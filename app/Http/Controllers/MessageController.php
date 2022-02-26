<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
use App\Models\Message;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    use GeneralTrait;
    public function sendMessage(Request $request, $chatRoomId)
    {
        try {
            if (!$request->has('message') && !$request->has('attach')) {
                return $this->returnError(202, 'you can not send empty message');
            }
            $chat_attach = "";
            if ($request->hasFile('attach')) {
                $chat_attach = $this->saveImage($request->attach, 'chat_attachment');
            }
            Message::create([
                'chat_room_id' => $chatRoomId,
                'sender_id' => Auth()->user()->id,
                'message' => $request->message,
                'attach' => $chat_attach
            ]);
            // fire event
            return $this->returnSuccessMessage('success');
        } catch (\Exception $e) {
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
}
