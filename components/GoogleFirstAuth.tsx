'use client';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect, useRef } from 'react';
export default function GoogleFirstAuth() {
  const handleGoogleAuth = async () => {
    // const response = await fetch('/api/auth/gdrive', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    const response = await fetch('/api/auth/gdrive');
    if (response.ok) {
      const data = await response.json();
      console.log('Google Drive 認証成功:', data);
    } else {
      console.error('Google Drive 認証失敗:', response.statusText);
    }
  }
  return (
    <Button onClick={handleGoogleAuth} className="btn btn-primary">
      Google Drive 初回認証
    </Button>    
  );  
}