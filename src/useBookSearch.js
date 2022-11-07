import {useEffect,useState} from 'react'
import axios from 'axios'

export default function useBookSearch(query,pageNum) {
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(false)
    const [books,setBooks] = useState([])
    const [hasMore,setHasMore] = useState(false)

    /* every time we change our query we rest our books array 
    so we don't have any of the old results shown up */
    useEffect(() =>{
        setBooks([])
    },[query])

    /* if we scrolled through the entire books in the api
    we will stop it from sending another unwanted requests */
    useEffect(()=>{
        setLoading(true)
        setError(false)
        let abort
        axios({
            method : 'GET',
            url: "http://openlibrary.org/search.json",
            params :{ q : query , page:pageNum },
            cancelToken : new axios.CancelToken( c => abort = c)
            /* it is used to stop the axios from searching 
            every character that is entered and instead 
            to operate on the whole word */
        }).then(res=>{
            setBooks(prevBooks => {
                return [...new Set([...prevBooks , ...res.data.docs.map(b => b.title)])]
            })
            setHasMore(res.data.docs.length > 0)
            setLoading(false)
        }).catch((e) =>{
             // to solve the error which result from the cancelToken
            if(axios.isCancel(e)) return
            setError(true)
            /*
            and it means to cancel every single request
            because we meant to cancel it  
            */
        })

        return () => abort()
    },[query,pageNum])

    return {loading, error, books , hasMore}
}
