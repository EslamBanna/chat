<?php

use App\Http\Controllers\ChatRoomController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/login', [UserController::class, 'login']);
Route::post('/sign-up', [UserController::class, 'signUp']);

Route::group(['middleware' => 'auth:sanctum', 'prefix' => 'auth'], function () {

    Route::get('/get-user-info/{userId}',[UserController::class,'getUserInfo']);

    Route::post('/create-chat-room',[ChatRoomController::class,'createChatRoom']);
    Route::post('/import-chat-rooms',[ChatRoomController::class,'importChatRooms']);
    Route::get('/get-chat-rooms',[ChatRoomController::class,'getChatRooms']);


    Route::post('/send-message/{chatRoomId}',[MessageController::class,'sendMessage']);
    Route::get('/get-messages/{chatRoomId}',[MessageController::class,'getMessages']);
    Route::get('/get-messages-counts/{chatRoomId}',[MessageController::class,'getMessagesCounts']);
    Route::get('/make-seen-chat/{chatRoomId}',[MessageController::class,'makeSeenChat']);

});
