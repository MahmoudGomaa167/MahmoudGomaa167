import React, { useEffect, useState } from 'react'
import styles from './Pagination.module.css'

const Pagination = ({ pageNumber, setPageNumber, pages, setLoading }) => {
    const [visiblePages, setVisiblePages] = useState([])


    const setPagesList = () => {
        if (pageNumber === 1) {
            if (pages === 1) {
                setVisiblePages([pages])
            } else if (pages === 2) {
                setVisiblePages([pages - 1, pages])
            } else {
                setVisiblePages([1, 2, 3])
            }
        } else if (pageNumber > 1 && pageNumber <= pages - 2) {
            setVisiblePages([pageNumber, pageNumber + 1, pageNumber + 2])
        } else if (pageNumber > 1 && pageNumber === pages - 1) {
            setVisiblePages([pageNumber - 1, pageNumber, pageNumber + 1])
        } else if (pageNumber > 2 && pageNumber === pages) {
            setVisiblePages([pageNumber - 2, pageNumber - 1, pageNumber])
        }
    }

    const changePage = (term) => {

        if (term === 'next' && visiblePages.includes(pages) === false) {
            visiblePages.forEach((page, index) => visiblePages[index]++)
            setPageNumber((prev) => prev + 1)
            setLoading(true)
        } else if (term === 'prev' && visiblePages[0] > 1) {
            visiblePages.forEach((page, index) => visiblePages[index]--)
            setPageNumber(prev => prev - 1)
            setLoading(true)
            console.log('render 1')
        }
        else if (term === 'prev' && pageNumber > 1) {
            setPageNumber(prev => prev - 1)
            setLoading(true)
        }
        else if (term === 'next' && pageNumber < pages) {
            setPageNumber((prev) => prev + 1)
            setLoading(true)
        }
    }

    const getCurrentPage = (page) => {
        if (page === pageNumber) {
            return;
        } else {
            setPageNumber(page)
            setLoading(true)
        }

    }

    useEffect(() => {
        setPagesList()
    }, [pages])

    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${pageNumber === 1 ? 'disabled' : ''}`}>
                    <a onClick={() => changePage('prev')} className={`${styles.pageLink} page-link`}>Previous</a>
                </li>

                {visiblePages.length && visiblePages.map(page => (
                    <li className="page-item" key={page}>
                        <a className={`${styles.pageLink} ${pageNumber === page ? styles.active : ''} page-link`} onClick={() => getCurrentPage(page)}>{page}</a>
                    </li>
                ))}


                <li className={`page-item ${pageNumber === pages ? 'disabled' : ''}`}>
                    <a onClick={() => changePage('next')} className={`${styles.pageLink} page-link`}>Next</a>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination