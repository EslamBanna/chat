<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\GeneralTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    use GeneralTrait;

    public function signUp(Request $request)
    {
        if (!$request->has('name') || !$request->has('email') || !$request->has('password')) {
            return $this->returnError(202, 'name, email and password fields is required');
        }
        $user_image = "";
        if ($request->hasFile('image')) {
            $user_image = $this->saveImage($request->image, 'user');
        }
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'image' => $user_image,
            'password' => Hash::make($request->password),
        ]);
        return $this->returnSuccessMessage('success');
        try {
        } catch (\Exception $e) {
            return $this->returnError(201, $e->getMessage());
        }
    }
    function login(Request $request)
    {
        try {
            $user = User::where('email', $request->email)->first();
            if (!$user || !Hash::check($request->password, $user->password)) {
                return $this->returnError(202, 'These credentials do not match our records.');
            }

            $token = $user->createToken('my-app-token')->plainTextToken;

            $response = [
                'user' => $user,
                'token' => $token
            ];

            return $this->returnData('data', $response);
        } catch (\Exception $e) {
            return $this->returnError(201, $e->getMessage());
        }
    }

    public function getUserInfo($userId)
    {
        try {
            $user = User::select('id', 'name', 'image')->find($userId);
            if (!$user) {
                return $this->returnError(202, 'this user is not exist');
            }
            return $this->returnData('data', $user);
        } catch (\Exception $e) {
            return $this->returnError(201, $e->getMessage());
        }
    }
}
