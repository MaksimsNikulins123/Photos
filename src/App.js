import { useEffect, useState } from 'react';
import './index.scss';
import Collection from './components/Collection/Collection';
import Categories from './components/Categories/Categories';


function App() {
  console.log('App created')

  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [allCollections, setAllCollections] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [categoryId, setCategoryId] = useState(0);
  const [sortedCollections, setSortedCollections] = useState([]);
  const [collectionsByPagination, setCollectionsByPagination] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  
  const maxCollectionsPerPage = 2;

  const sortCollections = (categoryId) => { 
    console.log('start sorting')
      if(categoryId === 0) {
        setSortedCollections(allCollections)
        paginateCollections(maxCollectionsPerPage, allCollections) 
      } else {
        const filteredCollections = allCollections.filter((collection) => {return collection.category === categoryId})
        setSortedCollections(filteredCollections)
        paginateCollections(maxCollectionsPerPage, filteredCollections)
      }

    }

  const paginateCollections = (maxCollectionsPerPage, collections) => {
    console.log('start paginate')
    setSortedCollections([...collections])
    const pages = Math.round(collections.length / maxCollectionsPerPage)
    setPages(pages)
    const newSortedArrayByPage = [];
    const copyOfSortedcollectionsArray = collections;
    do{
      const arrayToPush = []
        for (let index = 0; index < maxCollectionsPerPage; index++) {
          if(copyOfSortedcollectionsArray[index] !== undefined) {
            arrayToPush.push(copyOfSortedcollectionsArray[index])
          } 
        }
      newSortedArrayByPage.push(arrayToPush)
      copyOfSortedcollectionsArray.splice(0, maxCollectionsPerPage) 
  }
    while (copyOfSortedcollectionsArray.length > 0)
      setCollectionsByPagination(newSortedArrayByPage)
  }


  useEffect(() => {
    const url = new URL('https://674486fdb4e2e04abea29448.mockapi.io/photo_collections');
    fetch(url, {
      method: 'GET',
      headers: {'content-type':'application/json'},
    })
    .then(response => {
      if (response.ok) {
        return response.json();
    }})
    .then(json => {
      const categories = json[0].categories;
      const collections = json[0].collections;
      setCategories([...categories])
      setAllCollections([...collections])
      paginateCollections(maxCollectionsPerPage, [...collections])
    })
    .catch((error) => {
      console.warn(error);
      alert('Fail getting data');
    })
    .finally(() => setIsLoading(false));
  }, []);

  console.log(sortedCollections)


  return (
      <div className="app">
        <h1>My photo collection</h1>
        <div className="top">
          <ul className="tags">
            {
              categories.map((category, index) => (
                <Categories 
                  key={index}
                  category={category}
                  categoryId={categoryId}
                  setCategoryId={setCategoryId}
                  sortCollections={sortCollections}
                />
              ))
            }
          </ul>
          <input className="search-input" placeholder="search by name" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
        </div>
        <div className="content">
          {
            isLoading
            ?
            <h2>Loading...</h2>
            :
            collectionsByPagination[page - 1]
            .filter((collection) => {
              return collection.name.toLowerCase().includes(searchValue.toLowerCase())
            })
            .map((collection, index) => (
              <Collection
                key={index}
                name={collection.name}
                images={collection.photos}
              />
            ))
          }
          
        </div>
        <ul className="pagination">
            {
              [...Array(pages)].map((_, index) => (
              <li
              key={index}
              className={page === index + 1 ? "active" : ""}
              onClick={() => {
                setPage(index + 1)
              }}
              >
                {index + 1}
              </li>
            ))
            }  
        </ul>
      </div>
  )
}

export default App;
