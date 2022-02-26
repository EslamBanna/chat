<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;

class ChatRoomController extends Controller
{
    use GeneralTrait;
    public function createChatRoom(Request $request)
    {
        try {
            if (!$request->has('s_user_id')) {
                return $this->returnError(202, 'the s_user_id is required');
            }
            ChatRoom::create([
                'f_user_id' => Auth()->user()->id,
                's_user_id' => $request->s_user_id
            ]);
            return $this->returnSuccessMessage('success');
        } catch (\Exception $e) {
            return $this->returnError(201, $e->getMessage());
        }
    }

    public function getChatRooms()
    {
        try {
            $chat_rooms = ChatRoom::with(['secondUser' => function ($q) {
                $q->select('id', 'name', 'image', 'phone')->where('id', "!=", Auth()->user()->id);
            }])
                ->with(['firstUser' => function ($q) {
                    $q->select('id', 'name', 'image', 'phone')->where('id', "!=", Auth()->user()->id);
                }])
                ->where('f_user_id', Auth()->user()->id)
                ->orWhere('s_user_id', Auth()->user()->id)
                ->orderBy('updated_at', 'desc')
                ->get();
            return $this->returnData('data', $chat_rooms);
        } catch (\Exception $e) {
            return $this->returnError(201, $e->getMessage());
        }
    }
}
