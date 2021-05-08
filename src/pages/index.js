import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';


import { api } from '../services/api'
import { formatYear } from '../utils/formatYear';
import { formatGenre } from '../utils/formatGenre';


import styles from './Home.module.scss';


export default function Home({ trendingMoviesList, latestMovies }) {

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (

    <div className={styles.homePage}>
      <section className={styles.carousel}>
        <Carousel activeIndex={index} onSelect={handleSelect}>
          {latestMovies.map((slideMovie, index) => {

            return (
              <Carousel.Item key={slideMovie.id}>
                <img
                  src={slideMovie.backdrop}
                  alt={slideMovie.title}
                />

                <Carousel.Caption>
                  <h3>{slideMovie.title}</h3>
                  <p>{slideMovie.description}</p>
                </Carousel.Caption>
              </Carousel.Item>
            )
          })}
        </Carousel>
      </section>

      <section className={styles.movies}>
        <h2>Filmes da semana</h2>

        <div className={styles.gridMovies}>
          {trendingMoviesList.map((movie, index) => {
            return (

              <div key={movie.id} className={styles.card__movie}>

                <div className={styles.image__movie}>
                  <img className={styles.image__img} src={movie.poster} alt={movie.title} />

                  <figcaption className={styles.image__overlay}>
                    <div className={styles.image__rating}>
                      <h4>{movie.rating} / 10</h4>
                    </div>

                    <div className={styles.image__genre}>
                      <h4>{movie.genres[0]}</h4>
                      <h4>{movie.genres[1]}</h4>
                    </div>

                    <Link href={`./movie/${movie.id}`} className={styles.button__details}>Ver Detalhes</Link>
                  </figcaption>
                </div>

                <strong className={styles.movie__title}>{movie.title}</strong>
                <p className={styles.movie__year}>{movie.year}</p>

              </div>

            )
          })}
        </div>

      </section>
    </div>
  );

}

export const getStaticProps = async () => {

  const response = await api.get('trending/movie/week', {
    params: {
      api_key: 'd98980b6f729b75d3b64c9e86c4e45fa',
      language: 'pt-BR',
    }
  })

  const trendingMoviesList = response.data.results.map(movie => {

    const posterURL = 'https://image.tmdb.org/t/p/w200';
    const backdropURL = 'https://image.tmdb.org/t/p/original'

    return {
      id: movie.id,
      title: movie.title,
      poster: `${posterURL}${movie.poster_path}`,
      backdrop: `${backdropURL}${movie.backdrop_path}`,
      rating: movie.vote_average,
      year: formatYear(movie.release_date),
      genres: formatGenre(movie.genre_ids),
      description: movie.overview,
    }
  })

  const latestMovies = trendingMoviesList.slice(0, 6);

  return {
    props: {
      trendingMoviesList,
      latestMovies,
    },
    revalidate: 60 * 60 * 8, // 8 hours
  }

}