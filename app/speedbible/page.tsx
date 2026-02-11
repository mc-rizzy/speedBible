'use client';

import './speedbible.css'
import { useEffect, useRef, useState } from 'react';

import { getVersions, verseOfDay, getBooks, getChapters, getVerses, getVerse, getPassage} from '../actions';
import CheckBox from './check';
import TextFollower from './textFollower';
import DropDown from './dropDown';
import SideReader from './sideReader';

export default function SpeedRead() {

	const wordContainer = useRef<HTMLDivElement>(null);
	const textArea = useRef<HTMLTextAreaElement>(null);
	const nextTimeOut = useRef<NodeJS.Timeout | null>(null);
	const aimBox = useRef<HTMLDivElement>(null);

	const wordFeed = useRef([]) as any;
	const [wordFeedTrigger, triggerWordFeed] = useState(0);
	const [currentWordTrigger, triggerCurrentWord] = useState(0);
	const wordNumber = useRef(0);
	const goNextChapter = useRef(false);

	const [isPlaying, setIsPlaying] = useState(false);
	const [showAim, setShowAim] = useState(false);
	const [showBionic, setShowBionic] = useState(true);
	const [showRed, setShowRed] = useState(true);
	const [showSideView, setShowSideView] = useState(true);

	const bionicRef = useRef(showBionic);
	const redRef = useRef(showRed);

	const [currentWord, setCurrentWord] = useState("");
	const [versions, setVersions] = useState(null);
	const [currentVersion, setCurrentVersion] = useState(null);
	const [currentBooks, setCurrentBooks] = useState([]) as any;
	const [currentBook, setCurrentBook] = useState(1);
	const [currentChapters, setCurrentChapters] = useState([]) as any;
	const [currentChapter, setCurrentChapter] = useState(1)
	const [currentVerses, setCurrentVerses] = useState([]) as any;
	const [currentVerse, setCurrentVerse] = useState(1);
	const [passageData, setPassageData] = useState(null) as any;

	function populateFeed(paragraph: string): string[]{
		const wordList: string[] = [];
		const words = paragraph.split(/\s+/).filter(Boolean);
		wordFeed.current = words;
		triggerWordFeed((wordFeedTrigger+1)%2);
		return wordFeed.current;
	}

	function displayWord(word:string){
		if(wordContainer.current){
			setCurrentWord(word);
			triggerCurrentWord((prev)=>{return (prev+1)%2});

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
				
				if (i < boldLimit && bionicRef.current) span.style.fontWeight = 'bold';

				if (i==centerLetter) {
					if(redRef.current) span.style.color = 'red';
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
		goNextChapter.current = false;
		if(wordContainer.current && wordFeed.current.length > 0 && wordNumber.current < wordFeed.current.length){
			let word = wordFeed.current[wordNumber.current];
			displayWord(word);
			wordNumber.current++;

			let waitTime = 100;
			waitTime+=word.length*30;
			if(word.match(/[.,?!]/))
				waitTime*=1.5;

			if(wordFeed.current.length == 0)
				setIsPlaying(false);
			else
				nextTimeOut.current = setTimeout(function(){
					feedData();
				},waitTime);
		}else{
			if(currentChapter < currentChapters[currentChapters.length-1].id){
				setCurrentChapter((prev)=>{return Number(prev)+1});
				goNextChapter.current = true;
			}
		}
	}

	const loadChapterData = async () => {
		if(!currentVersion || !currentBooks || currentBooks.length==0 || currentBook == undefined) return;
		wordNumber.current = 0;
		setIsPlaying(false);
		const data = await getPassage(currentVersion, currentBooks[currentBook].id, currentChapter, undefined);
		if(data){
			setPassageData(data.content);
			populateFeed(data.content);
			if(goNextChapter.current==true)
				feedData();
		}
	}


	const setUpYouVersion = async () => {
		const dayNum = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
		const data = await verseOfDay(dayNum);
		if (data) {
			displayWord(data.passage_id);
		}
		
		const engVersions = await getVersions();
		if(engVersions){
			setVersions(engVersions.data as any);
			for(let i = 0; i < engVersions.data.length; i++)
				if(engVersions.data[i].abbreviation=="NASB1995")
					setCurrentVersion(engVersions.data[i].id as any);
		}
	};

	useEffect(()=>{
		if(isPlaying){
			if (wordFeed.current.length == 0) 
				if(!passageData || passageData.length == 0)
					populateFeed("Please choose a book and chapter.")
				else
					populateFeed(passageData);
			feedData();
		}else{
			if(nextTimeOut.current) clearTimeout(nextTimeOut.current);
		}
	}, [isPlaying]);


	useEffect(() => {
		setUpYouVersion();
		return () => clearTimeout(nextTimeOut.current!);
	}, []);

	useEffect(()=>{
		const handleKeyDown = (e:any) => {
			e.preventDefault();
			if (e.key === " ") setIsPlaying(prev => !prev);
		};
    	window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isPlaying]);

  	useEffect(()=>{
	if (aimBox.current)
		if(showAim)
			aimBox.current.style.opacity = "";
		else
			aimBox.current.style.opacity = "0";
  	},[showAim])

   	useEffect(()=>{
		redRef.current = showRed;
		bionicRef.current = showBionic;
		displayWord(currentWord);
  	},[showRed, showBionic])

	useEffect(()=>{
		const getData = async () => { try{
			const response = await getBooks(currentVersion);
			if(response) setCurrentBooks(response.data);
		}catch(error){console.log(error)}}
		if(currentVersion!=null){
			setCurrentBook(0)
			setCurrentChapter(1);
			setCurrentVerse(1);
			getData();
		}
	},[currentVersion])

	useEffect(()=>{
		if(currentBooks.length!=0){
			setCurrentChapters(currentBooks[currentBook].chapters);
			wordNumber.current = 0;
			setIsPlaying(false);
		}
	},[currentBooks, currentBook])

	useEffect(()=>{
		if(currentBooks.length!=0 && currentBooks.length!=0 && currentChapters.length!=0)
			setCurrentVerses(currentBooks[currentBook].chapters[currentChapter].verses);
		
	}, [currentChapters])

	useEffect(()=>{
		loadChapterData();
	}, [currentBook, currentChapter, currentVersion, currentBooks])

  return (
	<>
		<div ref={wordContainer} className='center roboto'></div>
		<div ref={aimBox} id='aimBox'></div>

		<button id="playBtn" className={`playButton ${isPlaying ? 'playing' : ''}`} 
		onClick={() => setIsPlaying(!isPlaying)}>
			<div className="play-icon"></div>
		</button>
		
		<TextFollower textArea={textArea} 
			bookVal={currentBook} book={currentBooks} setBook={(val:any)=>setCurrentBook(val)}
			chapterVal={currentChapter} chapter={currentChapters} setChapter={(val:any)=>setCurrentChapter(val)}
			verseVal={currentVerse} verse={currentVerses} setVerse={(val:any)=>setCurrentVerse(val)}
		/>
		<SideReader val={showSideView} wordList={wordFeed} wordNumber={wordNumber} feedTrigger={wordFeedTrigger} wordTrigger={currentWordTrigger}
		setWord={()=>{ displayWord(wordFeed.current[wordNumber.current]);} }/>

		<div className="checkContainer">
			<CheckBox name={"Red"} i={0} checked={true} onToggle={(val: boolean) => setShowRed(val)}/>
			<CheckBox name={"Bionic"} i={1} checked={true} onToggle={(val: boolean) => setShowBionic(val)}/>
			<CheckBox name={"Aim"} i={2} checked={false} onToggle={(val: boolean) => setShowAim(val)}/>
			<CheckBox name={"Side view"} i={3} checked={true} onToggle={(val: boolean) => setShowSideView(val)}/>
		</div>

		<DropDown val={currentVersion} options={versions} setValue={(val:any)=>setCurrentVersion(val)} mode={0}/>
	  
		<div className='promotions'>
			<a href="http://www.lockman.org/">Lockman Promotion</a>
			<a href="http://www.Biblica.com">Biblica Promotion</a>
		</div>
	</>
  );
}

// Notes:
//Usage Limits: You cannot display more than 2 chapters or 25 verses (whichever is greater) to a user at one time.
//No Alterations: You must use the text exactly as provided via the API. You cannot edit the text and must include all footnotes.

// show Bible ¥ouVersion liscencing
//text follower on other side
//speed bar at the top