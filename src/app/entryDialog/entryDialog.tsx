'use client'

import { useEffect, useState } from "react"

import { Slider } from "@/components/ui/slider"
import TaskAltIcon from '@mui/icons-material/TaskAlt';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getLifestyleCategories } from "@/lib/lifestyle-factors/getLifestyleCategories";
import { getUserPG } from "@/lib/user/getUserPG";
import { Oval } from 'react-loader-spinner'
import { putDailyEntry } from "./services/putDailyEntry";
import { getEntryFactors } from "./services/getEntryFactors";
import { deleteDailyFactors } from "./services/deleteDayFactors";
import { postDailyFactors } from "./services/postDailyFactors";
import { getEntry } from "./services/getEntry";
import { LifestyleCategory, LifestyleFactor } from "@/types/lifestyleFactors";
import { formatFactors } from "./utils/formatFactors";
import { formatDateForUser } from "@/utils/formatDateForUser";


type DailyEntryProps = {
  currentDate: string;
  getAllDailyEntriesCalendar?: () => void;
}

export type DailyEntry = {
  daily_entry_id?: number | null,
  entry_date: string,
  journal: string,
  mood_rating: number,
  productivity_rating: number,
  user_id?: number | null,
}
// i want to break this component down more
export default function EntryDialog( { currentDate, getAllDailyEntriesCalendar } : DailyEntryProps) {
  const { user, error, isLoading } = useUser();

  const [lifestyleFactors, setLifestyleFactors] = useState<LifestyleCategory[]>([])

  const [dailyFactorsData, setDailyFactorsData] = useState<{
    did: LifestyleFactor[] | [],
    didNot: LifestyleFactor[] | []
  }>({ did : [], didNot : []});


  const [dailyEntryData, setDailyEntryData] = useState<DailyEntry>({
    daily_entry_id : null,
    entry_date: currentDate,
    journal: '',
    mood_rating: 0,
    productivity_rating: 0,
    user_id : null,

  })

  const [isSaving, setIsSaving] = useState(false)

  const [isSaved, setIsSaved] = useState(false)

  const [errorSaving, setErrorSaving] = useState(true)

  useEffect(()=> {
    async function addUserIdToEntryData () {
      if(user && !error && !isLoading) {
        const { user_id } = await getUserPG(user)
        setDailyEntryData(prev => {
          return {
            ...prev,  
            user_id
          }
        });
      
      };
      
    };

    addUserIdToEntryData()
    
  },[user, error, isLoading])


  useEffect(()=> {
    
    if(user  && !error && !isLoading) {

      const getLifestyleFactorsData = async () => {
        try {
          const lsFactors = await getLifestyleCategories(user)
          if(!lsFactors) return 

          //filter out un named factors
          setLifestyleFactors(lsFactors.filter(cat => cat.name && cat.factors.length > 0))
          
        } catch (error) {
          console.error('Error fetching lifestylefactors', error)
        }
      }

      getLifestyleFactorsData()

    }
    
  },[user, error, isLoading])

  useEffect(()=> {
    if(user && !error && !isLoading) {
      const getEntryData = async () => {
        try {
          //fetchData for dailyFactorsData state.
          const entry = await getEntry(user, currentDate);
          if(!entry || !entry.daily_entry_id) return 
          setDailyEntryData(entry)
          
          //fetchData for dailyEntryFactors state.
          
          
        } catch (error) {
          console.error(error)
        }

      };
      
      getEntryData()

    }

  },[user, error, isLoading])

  useEffect(()=> {
    if(lifestyleFactors && lifestyleFactors.length > 0 && dailyEntryData.daily_entry_id) {

      const getDailyFactorsData = async () => {
        try {
          const { user_id } = await getUserPG(user)

          if(!dailyEntryData.daily_entry_id) return

          const dailyEntryFactors = await getEntryFactors(user_id, dailyEntryData.daily_entry_id)
          
          if(!dailyEntryFactors || dailyEntryFactors.length < 1) return

          const formattedFactors = formatFactors(dailyEntryFactors, lifestyleFactors)
          setDailyFactorsData(formattedFactors)
          
        } catch (error) {
          console.error('Error getting entry factors in entryDialog', error)
        }

        

      }
      getDailyFactorsData()
    }

    

  },[lifestyleFactors, dailyEntryData])

  // this function below is ugly lol
  const handleDidOrNot = (factor : LifestyleFactor, didOrNot: string) => {

    setDailyFactorsData((prev) => {
      const factorIsInDid = prev.did.some(f => f.lifestyle_factor_id === factor.lifestyle_factor_id);
      const factorIsInDidNot = prev.didNot.some(f => f.lifestyle_factor_id === factor.lifestyle_factor_id);

      let newDid = prev.did;
      let newDidNot = prev.didNot;

      if (didOrNot === 'did') {
        //if new factor is in DID then it's deleted, else its added
        newDid = factorIsInDid ? prev.did.filter(f => f.lifestyle_factor_id !== factor.lifestyle_factor_id) : [...prev.did, factor];
        //if new factor is in DIDNOT then it's deleted, else nothing happens
        newDidNot = factorIsInDidNot ? prev.didNot.filter(f => f.lifestyle_factor_id !== factor.lifestyle_factor_id) : prev.didNot;
      } else if (didOrNot === 'did not') {
        //if new factor is in DID NOT then it's deleted, else its added
        newDidNot = factorIsInDidNot ? prev.didNot.filter(f => f.lifestyle_factor_id !== factor.lifestyle_factor_id) : [...prev.didNot, factor];
        //if new factor is in DID then it's deleted, else nothing happens
        newDid = factorIsInDid ? prev.did.filter(f => f.lifestyle_factor_id !== factor.lifestyle_factor_id) : prev.did;
      }

      return {
        ...prev,
        did: newDid,
        didNot: newDidNot,
      };
    });
  
  };
  //lets see if this works lol
  const handleSave = async () => {

    try {
      
      setIsSaving(true)

      const dailyEntry = await putDailyEntry(dailyEntryData)

      if(!dailyEntry) return null
      
      const { daily_entry_id, user_id } = dailyEntry

      if(!daily_entry_id || !user_id) return null
      
      // const daily_entry_id = dailyEntry?.daily_entry_id
      
      const entryFactors = await getEntryFactors(user_id, daily_entry_id)

      if(entryFactors && entryFactors.length > 0) {
        //if daily entry is saved successfully and day factors already exist for this day, delete all factors.

        const fetchDeleteDailyFactors = await deleteDailyFactors( user_id, daily_entry_id)
        
        if(!fetchDeleteDailyFactors) return null

      } 

      const postDailyFactorsResults = await postDailyFactors(
        dailyFactorsData.did, 
        dailyFactorsData.didNot, 
        daily_entry_id, 
        user_id
      )

      setIsSaving(false)
      
      if(!postDailyFactorsResults) return null
      if(getAllDailyEntriesCalendar) getAllDailyEntriesCalendar()
      
      return {
        dailyEntry,
        didFactors : {
          didToday: postDailyFactorsResults.didToday, 
          didNotDoToday: postDailyFactorsResults.didNotDoToday 
        }
      };


    } catch (err) {

      console.error('error saving daily entry and corresponding factors', err);

      setIsSaving(false);

      return null;

    };

  };

  useEffect(()=> {
    // resets save message if user enters any value into any input on the page
    if(isSaved) setIsSaved(false)

    if(errorSaving) setErrorSaving(false)

  },[lifestyleFactors, 
    dailyFactorsData.did, 
    dailyFactorsData.didNot, 
    dailyEntryData.mood_rating, 
    dailyEntryData.productivity_rating, 
    dailyEntryData.journal 
  ])

  useEffect(()=> {
    if(isSaved) setErrorSaving(false)
    if(errorSaving) setIsSaved(false)

  },[isSaved, errorSaving])
  return (
    <div className="flex flex-col gap-8 h-full pt-4 pb-4 text-black">
      <span className=" text-xl font-semibold">How was your day?</span>
      <span className="text-xl rounded-lg text-black w-fit">{formatDateForUser(currentDate)}</span>

      <div className="flex flex-col gap-4 ">
        <div className="flex justify-between text-lg">
          <span>Mood Rating</span>
          <span>{dailyEntryData.mood_rating} / 10</span>
        </div>
        <Slider className=""
        defaultValue={[dailyEntryData.mood_rating]} 
        value={[dailyEntryData.mood_rating]}
        max={10} step={1} 
        onValueChange={(e) => {
          setDailyEntryData(prev => {
            return {
              ...prev,
              mood_rating: e[0]
            }
          })
        }}
        />
      </div>

      <div className="flex flex-col gap-4 ">
        <div className="flex justify-between text-lg">
          <span>Productivity Rating</span>
          <span>{dailyEntryData.productivity_rating} / 10</span>
        </div>
        <Slider className=""
        defaultValue={[dailyEntryData.productivity_rating]} 
        value={[dailyEntryData.productivity_rating]}
        max={10} step={1} 
        onValueChange={(e) => {
          setDailyEntryData(prev => {
            return {
              ...prev,
              productivity_rating: e[0]
            }
          })
        }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full ">
      
        <div className="relative flex flex-col h-full  gap-2">
          <span className="text-lg text-left">Lifestyle Factors</span>
          <div className="w-full md:max-h-96 h-full flex flex-col flex-1 gap-2 md:overflow-y-auto pr-2">
            {
            lifestyleFactors.map((category, index) => (
              <div key={index} className="w-full flex flex-col rounded-lg ">
                <span className="whitespace-nowrap overflow-hidden text-left text-ellipsis font-semibold text-black border-b-4 border-black p-2 w-fit">
                  {category.name}
                </span>
                {
                category.factors.map((factor, index) => (
                  <div className="flex items-center justify-between gap-2 w-full h-12 p-2 " key={factor.nano_id}>
                    <span className="">{factor.name}</span>
                    <div className="flex gap-2 h-full items-center">
                      <button className={`
                      ${dailyFactorsData.did.some(f => f.lifestyle_factor_id === factor.lifestyle_factor_id) ? 'bg-teal' : 'bg-gray-400'}
                       cursor-pointer hover:bg-teal transition-all rounded-lg text-white w-24 h-full
                      `}
                      onClick={()=> {
                        handleDidOrNot(factor, 'did')
                      }}>
                        <span className="p-2 ">Did</span>
                      </button>
                      <button className={`
                      ${dailyFactorsData.didNot.some(f => f.lifestyle_factor_id === factor.lifestyle_factor_id) ? 'bg-red-500' : 'bg-gray-400'}
                       cursor-pointer hover:bg-red-500 transition-all rounded-lg text-white w-24 h-full
                      `}
                      onClick={()=> {
                        handleDidOrNot(factor, 'did not')
                      }}>
                        <span className="p-2 ">Did Not</span>
                      </button>
                    </div>
                  </div>
                ))
                }
                
              </div>
            ))
            }
          </div>
        </div>

        <div className="flex flex-col gap-2 h-full ">
          <span className="text-lg text-left">Journal</span>
          <textarea 
          className="h-96 rounded-lg  p-4 outline-none resize-none" 
          placeholder="..." 
          name="journal" 
          value={dailyEntryData.journal}
          onChange={(e)=> setDailyEntryData(prev => {
            return {
              ...prev,
              journal: e.target.value
            }
          })}
          id=""/>
        </div>

      </div>

      <div className="flex gap-2 justify-end items-center">
        {
        isSaved &&
        <span className="text-green-500"> Saved Successfully! </span>
        }
        {
        errorSaving &&
        <span className="text-red-500"> Error Saving :( </span>
        }
        <Button className="w-20" onClick={()=> handleSave().then(result => {
          result ? setIsSaved(true) : setErrorSaving(true)
        })}>
          {
          isSaving ? 
          <Oval
            height={20}
            width={20}
            color="#FFFFFF"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#000000"
            strokeWidth={4}
            strokeWidthSecondary={4}

          />
          :
          <span>Save</span>

          }
        </Button>
      </div>
      
    </div>
  )
}
