import './speedbible.css'
import './sideReader.css'
import { useEffect, useRef, useState } from 'react';

export default function SideReader({val, wordList, wordNumber, trigger}:any) {

    const textContainer = useRef<HTMLDivElement>(null);
    const containerContainer = useRef<HTMLDivElement>(null);
    const [parsedData, setParsedData] = useState([]);

    useEffect(()=>{
        // console.log(chapterContent)
        fillSidebar(wordList);
        // setInterval(function(){
        //     console.log(chapterContent)
        // },500)
    }, [trigger]);

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
            span.className = 'singleWord';
            span.textContent = `${passage.current[i]}`;

            // if (i < boldLimit && showBionic) span.style.fontWeight = 'bold';

            // if (i==centerLetter) {
            //     if(showRed) span.style.color = 'red';
            //     centerSpan = span;
            // }
            textContainer.current.appendChild(span);
        }

        if(containerContainer.current) containerContainer.current.style.opacity="1";
    }

    function highlightWord(){
        let thing = textContainer.current?.children[wordNumber].classList;
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