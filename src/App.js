import React,{useState , useRef ,useCallback} from "react";
import useBookSearch from "./useBookSearch";


function App() {
  const [query,setQuery] = useState('')
  const [pageNum,setPageNum] = useState(1)

  const {
    loading,
    error,
    books,
    hasMore
  } = useBookSearch(query,pageNum)

  const observer = useRef()
  const lastElement = useCallback((node)=>{
    /* if the page is loading the calling for the api have to be stopped until
    the page is loaded */
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore){
        setPageNum(prevPageNum => prevPageNum + 1)
      }
    })
    if(node) observer.current.observe(node);
  },[loading , hasMore])

  function handleSearch(e){
    setQuery(e.target.value)
    setPageNum(1)
  }

  
  return (
    <>
      <input type={'text'} value={query} onChange={handleSearch}></input>
      {books.map((book,index) => {
        if (books.length === index + 1){
          return <div ref={lastElement} key={book}>{book}</div>
        } else{
          return <div key={book}>{book}</div>
        }
      })}
      <div>{loading && "Loading Please wait ..."}</div>
      <div>{error &&"Error Boi?!"}</div>
    </>
  )
}

export default App;
