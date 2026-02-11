'use client';

import './speedread.css'
import { useEffect, useRef, useState } from 'react';

export default function SpeedRead() {

  const wordContainer = useRef<HTMLDivElement>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);

  var wordFeed = [] as any;
  const [isPlaying, setIsPlaying] = useState(false);
  const nextTimeOut = useRef<NodeJS.Timeout | null>(null);;

  function populateFeed(paragraph: string): string[]{
    const wordList: string[] = [];
    const words = paragraph.split(/\s+/).filter(Boolean);

    words.forEach((word) => {
      wordFeed.push(word);
    });
    return wordFeed;
  }

  function displayWord(word:string){
    if(wordContainer.current){
      wordContainer.current.style.transform = ``;
      wordContainer.current.replaceChildren();

      let centerLetter = Math.ceil(word.length/2)-1;
      if(word.match(/[.,?!]/))
        centerLetter = Math.ceil((word.length-1)/2)-1;

      const boldLimit = word.length <= 3 ? 1 : Math.ceil(word.length * 0.5);

      let centerSpan;
      for (let i = 0; i < word.length; i++) {
        const span = document.createElement('span');
        span.textContent = `${word[i]}`;
        if (i < boldLimit) span.style.fontWeight = 'bold';

        if (i==centerLetter) {
          span.style.color = 'red';
          centerSpan = span;
        }
        wordContainer.current.appendChild(span);
      }

      let bounds = centerSpan?.getBoundingClientRect();
      if(!bounds) return;
      let center = bounds.left+(bounds.width/2);
      let correction = (window.innerWidth/2)-center;
      
      wordContainer.current.style.transform = `translate(${correction}px, 0)`;
    }
  }

  function feedData(){
    if(nextTimeOut.current) clearTimeout(nextTimeOut.current);
    if(wordContainer.current && wordFeed.length > 0){
      let word = wordFeed.shift();
      displayWord(word);

      let waitTime = 100;
      waitTime+=word.length*30;
      if(word.match(/[.,?!]/))
        waitTime*=1.5;

      
      if(wordFeed.length == 0)
        setIsPlaying(false);
      else
        nextTimeOut.current = setTimeout(function(){
          feedData();
        },waitTime);
    }
  }

  useEffect(()=>{
    if(isPlaying){
      if (feedData.length == 0) 
        if(textArea.current)
          populateFeed(textArea.current.value);
          if(textArea.current?.value.length == 0)
              populateFeed("Please add some text to read.")
      feedData();
    }else{
      if(nextTimeOut.current) clearTimeout(nextTimeOut.current);
    }
    
  }, [isPlaying]);

  useEffect(() => {
    displayWord("Click Play to Begin")
    // This runs when the component is destroyed
    return () => clearTimeout(nextTimeOut.current!);
  }, []);

  return (
    <>
      <div ref={wordContainer} className='center roboto'></div>
      {/* <div id='aimBox'></div> */}

      <button id="playBtn" className={`playButton ${isPlaying ? 'playing' : ''}`} 
      onClick={() => setIsPlaying(!isPlaying)}>
        <div className="play-icon"></div>
      </button>

      <div className="hoverZone" />
      
      <aside className="sidebar">
        <div className="sidebarContent">
          <textarea 
            ref={textArea}
            className="sidebarTextarea"
            placeholder="Type your notes here..."
            spellCheck={false}
          />
        </div>
      </aside>
      
    </>
  );
}
