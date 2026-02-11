"use client";
import { useState, useEffect } from "react";
import "./drop.css"; 

export default function DropDown({ val, options, setValue, mode }:any) {
    const [isOpen, setIsOpen] = useState(false);
    const [openName, setOpenName] = useState("Version");
    const [cssMode, setCssMode] = useState("hidden");

    function changeOption(data:any){
      setIsOpen(false);
      if(mode == 0){
        setOpenName(data.localized_abbreviation)
        setValue(data.id);
      }
      if(mode == 1){
        setOpenName(data.title)
        setValue(data.id);
      }
      if(mode == 2){
        setOpenName("Chapter "+data.id)
        console.log(data)
        // setValue(data.id);
      }
      if(mode == 3){
        setOpenName("Verse "+data.id)
        setValue(data.id);
      }
    }

    useEffect(()=>{
      if(mode == 0)
        setCssMode("version");
      if(mode == 1){
        setCssMode("box");
        setOpenName("Book");
      }
      if(mode == 2){
        setCssMode("box");
        setOpenName("Chapter");
      }
      if(mode == 3){
        setCssMode("box");
        setOpenName("Verse");
      }
    },[])

    useEffect(()=>{
      if(mode == 0){
        if(options)
          options.forEach((item:any)=>{
            if(item.id==val) setOpenName(item.localized_abbreviation)
        });
      }
      if(mode == 1){
        if(options && options[val]) setOpenName(options[val].title)
      }
      if(mode == 2){
        setOpenName("Chapter "+val)
      }
      if(mode == 3){
        setOpenName("Verse "+val)
      }
    }, [options, val]);

  return (
    <div className={cssMode}>
      <div className="sb-dropdown" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        <button className="sb-item" style={{  }}>{openName}</button>
        
        <div className={`scrollContainer sb-menu ${isOpen ? "is-open" : ""}`}>
          {options?.map((item: any) => (

            <button key={item.id} className="sb-item" onClick={()=>{changeOption(item)}}>
              {
                  (
                      {
                          0: item.localized_abbreviation,
                          1: item.title,
                          2: item.id,
                          3: item.id,
                      } as Record<number, any>
                  )[mode] || item.name
              }
            </button>

          ))}
        </div>
      </div>
    </div>
  );
}