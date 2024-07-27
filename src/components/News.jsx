"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function News() {
  const [news, setNews] = useState([]);
  const [articleNum, setArticleNum] = useState(3);
  useEffect(() => {
    fetch('https://saurav.tech/NewsAPI/top-headlines/category/business/us.json')
      .then((res) => res.json())
      .then((data) => {
        setNews(data.articles);
      });
  }, []);
  return (
    <div className='text-gray-700 space-y-3 bg-gray-100 rounded-xl pt-2'>
      <h4 className='font-bold text-xl px-4'>Whats Happening</h4>
      {news.slice(0, articleNum).map((article) => (
        <div key={article.url}>
          <Link href={article.url} target="_blank" className='text-sm font-bold'>
            <div className='flex items-center justify-between px-4 py-2 space-x-1 hover_bg-gray-200 transition duration-200'>
              <div className='space-y-0.5'>
                <h6>{article.title}</h6>
                <p className='text-xs font-medium text-gray-500'>{article.source.name}</p>
              </div>
              <img src={article.urlToImage} width={70} height={70} className='rounded-xl' />
            </div>
          </Link>  
        </div>
      ))}
      <button onClick={() => setArticleNum(articleNum + 3)}
        className="w-full py-2 bg-gray-200 hover:bg-gray-300 tranition duration-200">
        Load More
      </button>
    </div>
  )
}
