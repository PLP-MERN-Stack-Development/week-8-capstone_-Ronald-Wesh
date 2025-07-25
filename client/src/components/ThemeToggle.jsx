import { MoonIcon,SunIcon } from "@heroicons/react/24/solid";
import { Button } from "./ui/button";
import { useState,useEffect } from "react";
//useState: lets you store/change data in your component
//useEffect: lets you run code when something happens

export default function ThemeToggle(){//CREATING A REACT COMPONENT
    const [dark,setDark]=useState(//DARK=VARIABLE
        ()=>localStorage.getItem("theme")==="dark"
        //localStorage.getItem("theme") gets the previously saved theme (if any)
        //If it’s "dark", then dark = true, else dark = false
        //So that even if the user refreshes or closes the browser, their theme choice stays saved.
    );
    useEffect(()=>{//runs some code whenever dark changes
        const root=window.document.documentElement;// is the <html> tag in your webpage

//  If dark mode is ON (dark === true):
// We add the "dark" class to <html>, which tells Tailwind to apply dark styles.
// We save "dark" to localStorage.
// 🟢 If dark mode is OFF:
// We remove "dark" from <html> (so it’s light).

// Save "light" to localStorage.
        if(dark){
            root.classList.add("dark");
            localStorage.setItem("theme","dark");//Update localStorage
        }else{
            root.classList.remove("dark");
            localStorage.setItem("theme","light");
        }
    },[dark]);//Triggered when you mount using dark theme

    return(
        <Button className="cursor-pointer" variant="ghost" size="icon" aria-label="toggle theme" onClick={()=>setDark(!dark)}>
            {dark ? <SunIcon className="h-5 w-5"/>:<MoonIcon className="h-5 w-5"/>}
        </Button>
    )
}