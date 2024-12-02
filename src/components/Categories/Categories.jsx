
function Categories({category, categoryId, setCategoryId, sortCollections}) {
  return (
        <li 
          onClick={() => {
            setCategoryId(category.categoryId)
            sortCollections(category.categoryId)
          }}
          className={categoryId === category.categoryId ? 'active' : ''}
        >
          {category.name}
        </li> 
  )
}

export default Categories