<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatRoom extends Model
{
    use HasFactory;
    protected $fillable = ['f_user_id', 's_user_id'];
    
    public function firstUser()
    {
        return $this->belongsTo(User::class, 'f_user_id', 'id');
    }
    public function secondUser()
    {
        return $this->belongsTo(User::class, 's_user_id', 'id');
    }
}
