"use client";

import React, { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { app } from '../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; 
import Image from 'next/image';
import  { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';

export default function Input() {
    const { data: session } = useSession();
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [text, setText] = useState('');
    const [postLoading, setPostLoading] = useState(false);
    const imagePickRef = useRef(null);
    const db = getFirestore(app);
    const addImageToPost = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if(selectedFile) {
            uploadImageToStorage();
        }
    }, [selectedFile]);

    const uploadImageToStorage = () => {
        setImageFileUploading(true);
        const storage = getStorage(app)
        const fileName = new Date().getTime() + '-' + selectedFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = 
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            }, 
            (error) => {
                console.log(error);
                setImageFileUploading(false);
                setImageFileUrl(null);
                setSelectedFile(null);
            },
            () => {
                // Handle successful uploads on complete
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setImageFileUploading(false);
                    console.log("File available at", downloadURL);
                }).catch((error) => {
                    console.error("Error getting download URL", error);
                });
            }
        );
    }; 

    const handleSubmit = async () => {
        setPostLoading(true);
        const docRef = await addDoc(collection(db, 'posts'),{
            uid: session.user.uid,
            name: session.user.name,
            username: session.user.username,
            text: text,
            profileImg: session.user.image,
            timestamp: serverTimestamp(),
            image: imageFileUrl,
        });
        setPostLoading(false);
        setText('');
        setImageFileUrl(null);
        setSelectedFile(null);
        location.reload();
    };

    if (!session) return null;
    return (
    <div className='flex border-b border-gray-200 p-3 space-x-3 w-full'>
        <Image src={session.user.image} alt={session.user.name} width={44} height={44} className='h-11 w-11 rounded-full cursor-pointer hover:brightness-95' />
        <div className='w-full divide-y divide-gray-200 '>
            <textarea 
                className='w-full border-none tracking-wide min-h-[50px] text-gray-700' 
                placeholder="whats happening" 
                rows='2' 
                value={text}
                onChange={(e) => setText(e.target.value)}
                ></textarea>
            {selectedFile && (
                <Image 
                    src={imageFileUrl} 
                    alt='image' 
                    width={250} 
                    height={250} 
                    className={`w-full max-h-[250] object-cover cursor-pointer
                    ${imageFileUploading ? 'animate-pulse' : ''}`}
                />
            )}
            <div className='flex items-center justify-between pt-2.5'>
                <HiOutlinePhotograph 
                    onClick={() => imagePickRef.current.click()}
                    className='h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer'/>
                <input 
                    type="file" 
                    ref={imagePickRef} 
                    accept='image/avif, image/webp, video/webm' 
                    onChange={addImageToPost}
                    hidden
                    className=''
                    />
                <button 
                    disabled={!text || text.trim() === '' || postLoading || imageFileUploading}
                    className='bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50'
                    onClick={handleSubmit}
                    >Post
                </button>
            </div>
        </div>
    </div>
    )
}
