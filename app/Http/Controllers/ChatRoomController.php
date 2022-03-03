<?php

namespace App\Http\Controllers;

use App\Events\CreateNewChatRoom;
use App\Models\ChatRoom;
use App\Models\User;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ChatRoomController extends Controller
{
    use GeneralTrait;
    public function createChatRoom(Request $request)
    {
        try {

            if (!$request->has('phoneOrEmail')) {
                return $this->returnError(202, 'the phoneOrEmail fiels is required');
            }

            $validator = Validator::make($request->all(), [
                'phoneOrEmail' => 'required|email'
            ]);

            $s_user_id = null;
            if ($validator->fails()) {
                $user = User::where('phone', $request->phoneOrEmail)->first();
                if (!$user) {
                    return $this->returnError(203, 'this user not exist');
                }
                $s_user_id = $user->id;
            } else {
                $user = User::where('email', $request->phoneOrEmail)->first();
                if (!$user) {
                    return $this->returnError(204, 'this user not exist');
                }
                $s_user_id = $user->id;
            }
            if ($s_user_id == Auth()->user()->id) {
                return $this->returnError(205, 'you can not added your self');
            }
            $chat_room = ChatRoom::where([
                ['f_user_id', '=', Auth()->user()->id],
                ['s_user_id', '=', $s_user_id]
            ])
                ->orWhere([
                    ['f_user_id', '=', $s_user_id],
                    ['s_user_id', '=', Auth()->user()->id]
                ])
                ->first();
            if ($chat_room) {
                return $this->returnError(206, 'this chat room is already exist');
            }
            $chat_room = ChatRoom::create([
                'f_user_id' => Auth()->user()->id,
                's_user_id' => $s_user_id
            ]);
            $chat_room_data_to_reciver = [
                'chat_room_id' => $chat_room['id'],
                'lastUpdate' => $chat_room['updated_at'],
                'user' => $chat_room->secondUser
            ];

            $chat_room_data_to_sender = [
                'chat_room_id' => $chat_room['id'],
                'lastUpdate' => $chat_room['updated_at'],
                'user' => Auth()->user()
            ];
            event(new CreateNewChatRoom(Auth()->user()->id, $chat_room_data_to_reciver));
            event(new CreateNewChatRoom($s_user_id, $chat_room_data_to_sender));
            return $this->returnSuccessMessage('success');
        } catch (\Exception $e) {
            return $this->returnError(201, $e->getMessage());
        }
    }

    public function importChatRooms(Request $request)
    {
        DB::beginTransaction();
        try {
            if (!$request->hasFile('chat_rooms_file')) {
                return $this->returnError(202, 'chat chat_rooms_file is required');
            }
            $chat_rooms_file = $this->saveImage($request->chat_rooms_file, 'chat_rooms_imports');
            $contents = File::get(base_path() . '/public/images/chat_rooms_imports/' . $chat_rooms_file);
            $chat_created_success = [];
            $chat_not_created = [];
            foreach (explode(',', $contents) as $row) {
                $colum = "";
                if (filter_var($row, FILTER_VALIDATE_EMAIL)) {
                    $colum = 'email';
                } else {
                    $colum = 'phone';
                }
                $check_user = User::where($colum, $row)->first();
                if (!$check_user) {
                    array_push($chat_not_created, $row);
                } else {
                    array_push($chat_created_success, $row);
                    ChatRoom::create([
                        'f_user_id' => Auth()->user()->id,
                        's_user_id' => $check_user['id']
                    ]);
                }
            }
            DB::commit();
            return $this->returnSuccessMessage('success');
        } catch (\Exception $e) {
            DB::rollback();
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
