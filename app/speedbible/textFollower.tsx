import './sideReader.css'
import { useEffect, useRef, useState } from 'react';
import DropDown from './dropDown';

export default function TextFollower({bookVal, chapterVal, verseVal, textArea, v, setVersion, book, setBook, chapter, setChapter, verse, setVerse}:any) {

    return (
        <>
            <div className="hoverZone" />
            <aside className="sidebar">
                
                <DropDown val={bookVal} options={book} setValue={setBook} mode={1}/>
                <DropDown val={chapterVal} options={chapter} setValue={setChapter} mode={2}/>
                <DropDown val={verseVal} options={verse} setValue={setVerse} mode={3}/>
            </aside>
        </>
    );
}