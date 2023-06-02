const moviesCarousel = document.querySelector('.movies')
const btnPrev = document.querySelector('.btn-prev')
const btnNext = document.querySelector('.btn-next')

const page = document.querySelectorAll('.page')
const pageOne = document.querySelector('.one')
const pageTwo = document.querySelector('.two')
const pageThree = document.querySelector('.three')

function createMoviesCards() {
 
    for (let movieElement = 0; movieElement < 18; movieElement++) {
        
            const movieCard = document.createElement('div')
            const movieInfo = document.createElement('div')
            const movieTitle = document.createElement('span')
            const movieRating = document.createElement('span')
            const starImage = document.createElement('img')

            movieCard.classList.add('movie')
            
            movieInfo.classList.add('movie__info')
            
            movieTitle.classList.add('movie__title')
            
            movieRating.classList.add('movie__rating')


            movieInfo.appendChild(movieTitle)
            movieInfo.appendChild(movieRating)
            movieRating.appendChild(starImage)
            movieCard.appendChild(movieInfo)

            if(movieElement <= 5){
                pageOne.appendChild(movieCard)
            }else if(movieElement >= 6 && movieElement <= 11){
                pageTwo.appendChild(movieCard)
            }else{
                pageThree.appendChild(movieCard)
            }
            
            pageTwo.style.display = 'none'
            pageThree.style.display = 'none'

            moviesCarousel.appendChild(pageOne)
            moviesCarousel.appendChild(pageTwo)
            moviesCarousel.appendChild(pageThree)
    }

    
}

createMoviesCards()

const inputSearch = document.querySelector('.input')

inputSearch.addEventListener('keypress', (event)=>{
    if(event.key === 'Enter'){  
        
        if(inputSearch.value === ""){   
            pageOne.style.display = 'flex'
            pageTwo.style.display = 'none'
            pageThree.style.display = 'none'
    
            return fillMoviesCardStandard()
        }

        
        fillMoviesCardSearch()
    }
})

function errorMovies() {
    const h1Error = document.createElement('h1')
    
    h1Error.textContent = 'Filmes não localizados'
    
    moviesCarousel.appendChild(h1Error)
}

async function fillMoviesCardStandard() {
    const response = await api.get('/3/discover/movie?language=pt-BR&include_adult=false?results')

    const moviesData = response.data.results.slice(0,18)
    const moviesCards = document.querySelectorAll('.movie')
    const movieTitle = document.querySelectorAll('.movie__title')
    const movieRating = document.querySelectorAll('.movie__rating')
    const starImage = document.querySelectorAll('.movie__rating img')

    try {

        await moviesData.forEach((movie, index) => {
            moviesCards[index].style.backgroundImage = `url(${moviesData[index].poster_path})`
            movieTitle[index].textContent = moviesData[index].title

            starImage.src = './assets/estrela.svg' 
            starImage.alt = 'Estrela'
            movieRating[index].textContent = moviesData[index].vote_average
            
        })   
        
        await moviesCards.forEach((moviesStandard, index) => { 
            moviesCards[index].addEventListener('click', (event)=>{
                event.stopPropagation()
                modalMovie.classList.remove('hidden')
                fillModalMovies(moviesData[index].id)
                })
            })
        
    } catch (error) {
        errorMovies()
    }
}

fillMoviesCardStandard()

btnNext.addEventListener('click',()=>{
   
    if(!pageOne.style.display || pageOne.style.display == 'flex'){
        pageOne.style.display = 'none'
        pageTwo.style.display = 'flex'
    }else if(pageTwo.style.display == 'flex'){
        pageTwo.style.display = 'none'
        pageThree.style.display = 'flex'
    }else {
        pageThree.style.display = 'none'
        pageOne.style.display = 'flex'
    }
})

btnPrev.addEventListener('click',()=>{

    if(!pageOne.style.display || pageOne.style.display == 'flex'){
        pageOne.style.display = 'none'
        pageThree.style.display = 'flex'
    }else if(pageThree.style.display == 'flex'){
        pageThree.style.display = 'none'
        pageTwo.style.display = 'flex'
    }else {
        pageTwo.style.display = 'none'
        pageOne.style.display = 'flex'
    }
})

async function fillMoviesCardSearch() {
    const response = await api.get('/3/search/movie?language=pt-BR&include_adult=false&query=' + inputSearch.value)
    
    const moviesSearch = response.data.results.slice(0, 18)
    const moviesCards = document.querySelectorAll('.movie')
    const movieTitle = document.querySelectorAll('.movie__title')

    try {
         
        await moviesSearch.forEach((m, index)=>{
        moviesCards[index].style.backgroundImage = `url(${m.poster_path})`
        movieTitle[index].textContent = m.title     
    })
                
    await moviesCards.forEach((movie, index) => {
        moviesCards[index].addEventListener('click', (event)=>{
            event.stopPropagation()
            modalMovie.classList.remove('hidden')
            fillModalMovies(moviesSearch[index].id)
        })
    })
    
    } catch (error) {
        errorMovies()
    }

    inputSearch.value = ''
}

const modalMovie = document.querySelector('.modal')
const modalCloseBtn = document.querySelector('.modal__close')
const modalTitle = document.querySelector('.modal__title')
const modalImage = document.querySelector('.modal__img')
const modalDescription = document.querySelector('.modal__description')
const modalAverage = document.querySelector('.modal__average')

async function fillModalMovies(movies) {
    const response = await api.get(`/3/movie/${movies}?language=pt-BR`)

    const modalMovieData = response.data

    try {     
            modalTitle.textContent = await modalMovieData.title
            modalImage.src = await modalMovieData.backdrop_path
            modalDescription.textContent = await modalMovieData.overview
            
            modalAverage.textContent = await modalMovieData.vote_average

        } catch (error) {
            modalTitle.textContent = 'Filme não encontrado'
            modalDescription.textContent = 'Filme não encontrado'
        }
}

modalCloseBtn.addEventListener('click', ()=>{
    modalTitle.textContent = ''
    modalImage.src = ''
    modalDescription.textContent = ''
    modalAverage.textContent = ''

    modalMovie.classList.add('hidden')
})

const highLight = document.querySelector('.highlight')
const highlightVideoLink = document.querySelector('.highlight__video-link')
const highlightVideo = document.querySelector('.highlight__video')
const highlightTitle = document.querySelector('.highlight__title')
const highlightRating = document.querySelector('.highlight__rating')
const highlightGenres = document.querySelector('.highlight__genres')
const highlightLaunch = document.querySelector('.highlight__launch')
const highlightDescription = document.querySelector('.highlight__description')

async function todayMovie() {
    const response = await api.get('/3/movie/436969?language=pt-BR')

    const movieHighLight = response.data

    const launchDate = new Date(await movieHighLight.release_date).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })

    highlightVideo.style.backgroundImage = `url(${movieHighLight.backdrop_path})`
    highlightVideo.style.backgroundSize = 'cover'

    highlightTitle.textContent = movieHighLight.title
    highlightRating.textContent = movieHighLight.vote_average
    highlightGenres.textContent = `${movieHighLight.genres[0].name}, ${movieHighLight.genres[1].name}, ${movieHighLight.genres[2].name}`
    highlightLaunch.textContent = launchDate  
    highlightDescription.textContent = movieHighLight.overview
}

todayMovie()

async function todayMovieVideoLink() {  
    const response = await api.get('/3/movie/436969/videos?language=pt-BR')

    const movieHighLightLink = response.data.results

    highlightVideoLink.href = await 'https://www.youtube.com/watch?v=' + movieHighLightLink[0].key
}

todayMovieVideoLink()

const btnTheme = document.querySelector('.btn-theme')
const root = document.querySelector(':root')

btnTheme.addEventListener('click', ()=>{
    const bgColor = root.style.getPropertyValue('--background')

    if(bgColor === '#fff'|| !bgColor){
        btnPrev.src = './assets/arrow-left-light.svg'
        btnNext.src = './assets/arrow-right-light.svg'
        btnTheme.src = './assets/dark-mode.svg'
        modalCloseBtn.src = './assets/close.svg'
        inputSearch.style.backgroundColor = '#3E434D'

        root.style.setProperty('--background', '#1B2028')
        root.style.setProperty('--input-color', '#665F5F')
        root.style.setProperty('--text-color', '#FFFFFF')
        root.style.setProperty('--bg-secondary', '#2D3440')
        root.style.setProperty('--bg-modal', '#2D3440')

        return
    }

    btnPrev.src = './assets/arrow-left-dark.svg'
    btnNext.src = './assets/arrow-right-dark.svg'
    btnTheme.src = './assets/light-mode.svg'
    modalCloseBtn.src = './assets/close-dark.svg'
    inputSearch.style.backgroundColor = '#FFFFFF'

    root.style.setProperty('--background', '#fff')
    root.style.setProperty('--input-color', '#979797')
    root.style.setProperty('--text-color', '#1b2028')
    root.style.setProperty('--bg-secondary', '#ededed')
    root.style.setProperty('--bg-modal', '#ededed')
})