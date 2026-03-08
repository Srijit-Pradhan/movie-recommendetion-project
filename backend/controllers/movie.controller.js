// Step 1: Movie model import korchi
const Movie = require("../models/movie.model"); // Updated to movie.model

// Step 2: Sob movie pabar jinish (Public)
// Pagination, Search ar Filter er suvidha dewa ache
// GET /api/movies
const getMovies = async (req, res) => {
  try {
    // Url e jodi 'keyword' thake (jemondhoro: search box theke)
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: "i", // 'i' mane case insensitive (boro/choto haat matter korbe na)
          },
        }
      : {};

    // Category filter korar jonno
    const categoryFilter = req.query.category
      ? {
          category: req.query.category,
        }
      : {};

    // Genre anujayi filter korar jonno
    const genreFilter = req.query.genre
      ? {
          genre: {
            $regex: req.query.genre,
            $options: "i",
          },
        }
      : {};

    // Pagination (infinite scroll ba page set) er jonno
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit; // kotogulo skip korbo

    // Sob filter gulo ekta objet e juro kore dichi
    const query = { ...keyword, ...categoryFilter, ...genreFilter };

    // Database theke movie gulo fetch korlam (skip ar limit add kore)
    const movies = await Movie.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Kothogulo total movie ache setao jene nilam
    const total = await Movie.countDocuments(query);

    // Front end ke movie gulo pathalam
    res.json({
      movies,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    // Error asle server error 500 dibo
    res.status(500).json({ message: error.message });
  }
};

// Step 3: Ekta particular movie pawar controller (id pass korle)
// GET /api/movies/:id
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findOne({ _id: req.params.id });
    if (movie) {
      res.json(movie); // pawa gele pathye dao
    } else {
      res.json(null); // TMDB item ekhono rate na hole local DB te thakbe na, tai null dichi (404 thekanor jonno)
    }
  } catch (error) {
    res.json(null);
  }
};

// Step 4: Notun movie add korar function (Eta shudhu Admin der jonno)
// POST /api/movies
const createMovie = async (req, res) => {
  try {
    const {
      title,
      posterUrl,
      description,
      releaseDate,
      trailerLink,
      genre,
      category,
    } = req.body;

    // Notun data diye movie object toiri korchi
    const movie = new Movie({
      title,
      posterUrl,
      description,
      releaseDate,
      trailerLink,
      genre,
      category,
    });

    // Database e save korlam
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Step 5: Kono movie k update ba edit kora (Shudhu Admin)
// PUT /api/movies/:id
const updateMovie = async (req, res) => {
  try {
    const {
      title,
      posterUrl,
      description,
      releaseDate,
      trailerLink,
      genre,
      category,
    } = req.body;

    // Aage movie ta khuje bar koro
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      // Notun data asle thik korbe, na hole puronotai theke jabe
      movie.title = title || movie.title;
      movie.posterUrl = posterUrl || movie.posterUrl;
      movie.description = description || movie.description;
      movie.releaseDate = releaseDate || movie.releaseDate;
      movie.trailerLink = trailerLink || movie.trailerLink;
      movie.genre = genre || movie.genre;
      movie.category = category || movie.category;

      const updatedMovie = await movie.save();
      res.json(updatedMovie);
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Step 6: Movie delete kora (Admin only)
// DELETE /api/movies/:id
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    // Jodi movie pawa jay, tokhon delete korbo
    if (movie) {
      await Movie.deleteOne({ _id: movie._id });
      res.json({ message: "Movie removed successfully" });
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Step 7: Rate a movie (Logged in user only)
// Eta diye user ra kono movie ke rating (1-5) dite pare
// POST /api/movies/:id/rate
const rateMovie = async (req, res) => {
  try {
    const { rating, mediaType } = req.body;
    let movie = await Movie.findById(req.params.id);

    // Jodi db te na thake (TMDB movie rating dewar somoy choto placeholder toiri korchi)
    if (!movie) {
      movie = new Movie({
        _id: req.params.id,
        mediaType: mediaType || "movie", // Frontend theke asha mediaType store korchi
      });
    }

    // Only handle ratings if rating > 0
    if (rating && rating > 0) {
      // Check korchi j user ki aage thekei eita rate koreche kina
      const existingRatingIndex = movie.ratings.findIndex(
        (r) => r.userId.toString() === req.user._id.toString(),
      );

      if (existingRatingIndex >= 0) {
        // Jodi age diye thake tahole sei rating tai update hoye jabe
        movie.ratings[existingRatingIndex].rating = Number(rating);
      } else {
        // Natun rating add korchi array te
        movie.ratings.push({
          userId: req.user._id,
          rating: Number(rating),
        });
      }
    } else if (mediaType) {
      // Type sync logic: Just update type if missing
      movie.mediaType = mediaType;
    }

    await movie.save();
    res
      .status(200)
      .json({
        message: "Rating submitted successfully",
        ratings: movie.ratings,
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Step 7.5: Public Type Sync (Frontend discovery hobar por backend e save kore rakhbe)
// Eta shudhu mediaType update korar jonno (No auth required for better healing)
const syncMediaType = async (req, res) => {
  try {
    const { mediaType } = req.body;
    let movie = await Movie.findOne({ _id: req.params.id });

    if (!movie) {
      movie = await Movie.create({
        _id: req.params.id,
        mediaType: mediaType || "movie",
      });
    } else if (
      mediaType &&
      (!movie.mediaType || movie.mediaType !== mediaType)
    ) {
      movie.mediaType = mediaType;
      await movie.save();
    }

    res.status(200).json({ message: "Type synced successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Step 8: Sob kota controller functions export korchi jate routes gulo ei file theke niye use korte pare
module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  rateMovie,
  syncMediaType,
};
