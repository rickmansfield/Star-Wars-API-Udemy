import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // I'm using useCallback to avoid infinite loop. useCallback will make sure that the function is not recreated when the component re-renders.it basically memoizes or caches the function for single use. By doing this the fuction is only recreated when the dependencies change. If we don't use useCallback, the function is created every time the component is re-rendered, which can cause performance issues.

  //summary: the useEffect ensures 'fectMovieHandler' is only called once on load and useCallbcak caches the function for the single use
  const fetchMoviesHander = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-http-a689d-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      // const transformedMovies = data.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // });
      setMovies(loadedMovies);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  // to learn to build a post request to add a movie to the database, see https://www.udemy.com/course/react-the-complete-guide-incl-redux/learn/lecture/25599826#overview videos 181-182

  useEffect(() => {
    fetchMoviesHander();
  }, [fetchMoviesHander]);

  async function addMovieHandler(movie) {
    const response = await fetch("https://react-http-a689d-default-rtdb.firebaseio.com/movies.json", {
      method: "POST",
      body: JSON.stringify(movie),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
  }

  let content = <p>Found no movies.</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHander}>Fetch Movies</button>
        <div className="date">Current Date {date}</div>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
