<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    protected $fillable = [
        'chat_room_id',
        'sender_id',
        'message',
        'attach',
    ];

    public function chatRoom()
    {
        return $this->belongsTo(ChatRoom::class, 'chat_room_id', 'id');
    }

    public function getAttachAttribute($value)
    {
        $actual_link = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/';
        return ($value == null ? '' : $actual_link . 'images/chat_attachments/' . $value);
    }

    public function sender(){
        return $this->belongsTo(User::class, 'sender_id','id')->where('id', '!=', Auth()->user()->id);
    }
}
