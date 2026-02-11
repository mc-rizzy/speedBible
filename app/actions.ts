'use server'

import { bibleClient } from '@/lib/youversion';

const apiKey = process.env.YOUVERSION;

export async function verseOfDay(day: number) {
  try {
    const verse = await bibleClient.getVOTD(day);
    return verse;
  } catch (error) {
    console.error("SDK Fetch Error:", error);
    return null;
  }
}

export async function getVersions(){
  try{
    const versions = await bibleClient.getVersions('en', undefined, {
      all_available: true,
      page_size: 100
    });
    return versions

  } catch (error) {
    console.error("SDK Fetch Error:", error);
    return null;
  }
}

export async function getBooks(versionID: any){
  try{
    const books = await bibleClient.getBooks(versionID)
    return books

  } catch (error) {
    console.error("SDK Fetch Error:", error);
    return null;
  }
}

export async function getChapters(versionID: any, book:any){
  try{
    const chapters = await bibleClient.getChapters(versionID, book)
    return chapters

  } catch (error) {
    console.error("SDK Fetch Error:", error);
    return null;
  }
}

export async function getVerses(versionID: any, book:any, chapter:any){
  try{
    const verses = await bibleClient.getVerses(versionID, book, chapter);
    // const verses = await bibleClient.getVerses(111, 'GEN', 1)
    return verses;

  } catch (error) {
    console.error("SDK Fetch Error:", error);
    return null;
  }
}

export async function getVerse(versionID: any, book:any, chapter:any, verse:any){
  try{
    const data = await bibleClient.getVerse(versionID, book, chapter, verse);
    // const verse = await bibleClient.getVerse(111, 'GEN', 1, 1)
    return data;

  } catch (error) {
    console.error("SDK Fetch Error:", error);
    return null;
  }
}

export async function getPassage(versionID: any, book:any, chapter:any, verse:any){
    // const verse = await bibleClient.getPassage(111, 'JHN.3.16', 'html') // Single verse (request HTML)
    // const passage = await bibleClient.getPassage(111, 'GEN.1.1-5') // Verse range (plain text by default)
    // const chapter = await bibleClient.getPassage(111, 'GEN.1') // Entire chapter
    // const formatted = await bibleClient.getPassage(111, 'JHN.3.16', 'html', true, true) // With formatting options
  try{
    let section = `${book}.${chapter}`;
    if(verse)
      section+=`.${verse}`;
    const data = await bibleClient.getPassage(versionID, section, 'text');
    return data;

  } catch (error) {
    console.error("SDK Fetch Error:", error);
    return null;
  }
}