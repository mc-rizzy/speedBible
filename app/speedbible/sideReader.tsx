import './speedbible.css'
import './sideReader.css'
import { useEffect, useRef, useState } from 'react';

export default function SideReader({ val, wordList, wordNumber, feedTrigger, wordTrigger, setWord }:any) {

    const textContainer = useRef<HTMLDivElement>(null);
    const containerContainer = useRef<HTMLDivElement>(null);
    const previousWord = useRef(null) as any;
    const wordOffset = useRef(-1) as any;

    useEffect(()=>{
        fillSidebar(wordList);
    }, [feedTrigger]);

    useEffect(()=>{
        updateWord();
    }, [wordTrigger]);

    useEffect(()=>{
        if(textContainer.current)
            if(val)
                textContainer.current.style.opacity = "1";
            else
                textContainer.current.style.opacity = "0";
    }, [val])

    function fillSidebar(passage:any){
        if(!textContainer.current || !passage || !passage.current) return;
        if(containerContainer.current) containerContainer.current.style.opacity="0";
        textContainer.current.replaceChildren();

        for (let i = 0; i < passage.current.length; i++) {
            const span = document.createElement('span');
            span.onclick = () => {
                wordNumber.current = i;
                setWord();
                wordOffset.current = 0;
            }
            span.className = 'singleWord';
            span.textContent = `${passage.current[i]}`;
            textContainer.current.appendChild(span);
        }

        if(containerContainer.current) containerContainer.current.style.opacity="1";
    }

    function updateWord(){
        if(previousWord.current!=null){
            let el = textContainer.current?.children[previousWord.current];
            el?.classList.add('readWord');
            el?.classList.remove('currentWord');
        }

        let el = textContainer.current?.children[wordNumber.current+wordOffset.current];
        el?.classList.add('currentWord');
        previousWord.current = wordNumber.current+wordOffset.current;

        wordOffset.current = -1;
    }

    return (
        <>
            <aside ref={containerContainer} className="sideReader">
                <div ref={textContainer} className="sidebarContent wordContainer">

                </div>
            </aside>
        </>
    );
}