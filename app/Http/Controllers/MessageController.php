<?php

namespace App\Http\Controllers;

use App\Events\ChatSeen;
use App\Events\SendMessage;
use App\Models\ChatRoom;
use App\Models\Message;
use App\Models\User;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    use GeneralTrait;
    public function sendMessage(Request $request, $chatRoomId)
    {
        DB::beginTransaction();
        try {
            $chatRoom = ChatRoom::find($chatRoomId);
            if (!$chatRoom) {
                return $this->returnError(202, 'this is invalid chat room');
            }
            if (!$request->has('message') && !$request->has('attach')) {
                return $this->returnError(203, 'you can not send empty message');
            }
            $chat_attach = "";
            if ($request->hasFile('attach')) {
                $chat_attach = $this->saveImage($request->attach, 'chat_attachment');
                $actual_link = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/';
                $chat_attach = $actual_link . 'images/chat_attachments/' . $chat_attach;
            }
            $chatRoom->update([
                'updated_at' => \Carbon\Carbon::now()
            ]);
            $message = Message::create([
                'chat_room_id' => $chatRoomId,
                'sender_id' => Auth()->user()->id,
                'message' => $request->message,
                'attach' => $chat_attach
            ]);
            $s_user_id = null;
            if ($chatRoom['f_user_id'] == Auth()->user()->id) {
                $s_user_id = $chatRoom['s_user_id'];
            } else {
                $s_user_id = $chatRoom['f_user_id'];
            }
            $s_user = User::find($s_user_id);
            $s_user_name = $s_user['name'];
            $s_user_image = $s_user['image'];
            // fire event
            DB::commit();
            event(new SendMessage($request->message, $chat_attach, $chatRoomId, Auth()->user()->id,  $s_user_name, $s_user_image, 1, $message['created_at']));
            event(new SendMessage($request->message, $chat_attach, $chatRoomId, $s_user_id, Auth()->user()->name, Auth()->user()->image, 0, $message['created_at']));
            return $this->returnSuccessMessage('success');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->returnError(201, $e->getMessage());
        }
    }

    public function getMessages($chatRoomId)
    {
        try {
            $chatRoom = ChatRoom::find($chatRoomId);
            if (!$chatRoom) {
                return $this->returnError(202, 'this chat rooms is not available');
            }
            $messages = Message::with('sender')->where('chat_room_id', $chatRoomId)->get();
            return $this->returnData('data', $messages);
        } catch (\Exception $e) {
            return $this->returnError(201, $e->getMessage());
        }
    }

    public function getMessagesCounts($chatRoomId)
    {
        try {
            $chatRoom = ChatRoom::find($chatRoomId);
            if (!$chatRoom) {
                return $this->returnError(202, 'this chat rooms is not available');
            }
            $messages_count = Message::where('chat_room_id', $chatRoomId)->count();
            return $this->returnData('data', $messages_count);
        } catch (\Exception $e) {
            return $this->returnError(201, $e->getMessage());
        }
    }

    public function makeSeenChat($chatRoomId)
    {
        DB::beginTransaction();
        try {
            $chatRoom = ChatRoom::find($chatRoomId);
            if (!$chatRoom) {
                return $this->returnError(202, 'this chat rooms is not available');
            }
            // ChatRoom::whereHas([''])
            Message::where('chat_room_id', $chatRoomId)
                ->where('sender_id', '!=', Auth()->user()->id)
                ->where('msg_status', '=', 'not_seen')
                ->update([
                    'msg_status' => 'seen'
                ]);
            $s_user_id = 0;
            if ($chatRoom['s_user_id'] == Auth()->user()->id) {
                $s_user_id = $chatRoom['f_user_id'];
            } else {
                $s_user_id = $chatRoom['s_user_id'];
            }
            DB::commit();
            event(new ChatSeen($chatRoomId, $s_user_id));
            return $this->returnSuccessMessage('success');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->returnError(201, $e->getMessage());
        }
    }
}
