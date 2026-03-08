// Step 1: Hooks for page working
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
// useLocation nilam jate URL er path (/admin/movies) check kora jay
import { useNavigate, useLocation, Link } from "react-router-dom";
import Loader from "../components/Loader";
import "./Admin.css";

const AdminDashboard = () => {
  // Global login details anchi jate niropotta nishchit kora jay
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // URL tracking korar jonno

  // Step 2: Dorkari local state gulo jeno user/movie deka jai r add kora jai
  const [movies, setMovies] = useState([]); // joto movie ache tar list ektro kore nibe
  const [users, setUsers] = useState([]); // shob user er account nebe
  const [loading, setLoading] = useState(true); // first loading page asar shmy
  const [formLoading, setFormLoading] = useState(false); // form saving a lagbe

  /**
   * Step 2.1: Path based Tab control (Normal Routing)
   * Jodi URL path e 'users' thake, tobe 'users' tab active hobe, noile 'movies'.
   * If URL path contains 'users', active tab is 'users', else 'movies'.
   */
  const activeTab = location.pathname.includes("/users") ? "users" : "movies";

  const [editingMovieId, setEditingMovieId] = useState(null); // kon movie ta edit hochhe seta track er jnno

  // Create / Edit Form submit karar jnno temporary values store rakhte
  const [formData, setFormData] = useState({
    title: "",
    posterUrl: "",
    description: "",
    releaseDate: "",
    trailerLink: "",
    genre: "",
    category: "",
  });

  // Step 3: Security check / Protected Route -> sudo admin ra e ashte parbe
  useEffect(() => {
    if (!user) {
      navigate("/login"); // login na takhle ferot jaao
    } else if (!user.isAdmin) {
      navigate("/"); // user jodi log theko but admin role na takhle home e ferot paathao
    }
  }, [user, navigate]);

  // Step 4: Data anar function API theke
  const fetchMovies = async () => {
    try {
      // url hit kre data anchi (unprotected kano na publicly movie list je keu dekhte pare)
      const { data } = await axios.get(
        "http://localhost:3000/api/movies?limit=100",
      );
      setMovies(data.movies || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      // User er privacy tai data anar time a auth token joruri
      const { data } = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Jotokhn page UI toiri hosche first time a 2to table ek saathe load kore nibo by promise all
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (user && user.isAdmin) {
        // Eksthae dutoi fetch korar func
        await Promise.all([fetchMovies(), fetchUsers()]);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // form er box gulote kichu lekhle (type), eita oi word ta niye amader current state(formData) er sathe update rakhbe
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 5:  Movie toiri / update korar ashol kaj ekhne hosche
  const handleMovieSubmit = async (e) => {
    e.preventDefault(); // submit the page reload atkaano
    setFormLoading(true);
    try {
      // User ja likhbe category input e ('Action, Trend') seta ke split kore array banabo (, diye alada krb)
      let rawCategories = formData.category.split(",");
      let categoryArray = [];
      for (let i = 0; i < rawCategories.length; i++) {
        let trimmedCat = rawCategories[i].trim(); // pasher space katiye nichi
        if (trimmedCat !== "") {
          categoryArray.push(trimmedCat);
        }
      }

      // database ektahole erom dekhte final request hobe
      const payload = { ...formData, category: categoryArray };

      // Jodi agei editing id check kora theke mane "EDIT" mode a ache noile "CREATE"
      if (editingMovieId) {
        // Edit(Update) Data
        await axios.put(
          `http://localhost:3000/api/movies/${editingMovieId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        alert("Movie updated successfully!");
        setEditingMovieId(null);
      } else {
        // Create Data
        await axios.post("http://localhost:3000/api/movies", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Movie added successfully!");
      }

      // Form box  gulo khali/blank krlm
      setFormData({
        title: "",
        posterUrl: "",
        description: "",
        releaseDate: "",
        trailerLink: "",
        genre: "",
        category: "",
      });
      fetchMovies(); // shob houar por refresh grid showing
    } catch (error) {
      alert(error.response?.data?.message || "Error saving movie");
    } finally {
      setFormLoading(false);
    }
  };

  // Edit Button e kono  movie er upor click korle form tak sei purbo data dite hobe naile ki edit korbe !!
  const handleEditClick = (m) => {
    // Database a jeta list kora ache (array)  setake ", " dia gathiye normal nam e voriye di format display korte..
    let categoriesString = "";
    if (m.category && m.category.join) {
      categoriesString = m.category.join(", ");
    } else if (m.category) {
      categoriesString = m.category;
    }

    // Date formatting .. mongo db etoo 2026-06-25T... store korsi amar sorbo prthoom tuku kete form deboa
    let dateString = "";
    if (m.releaseDate) {
      dateString = m.releaseDate.substring(0, 10);
    }

    // purono dewa value form er pete purlam form UI fill krte
    setFormData({
      title: m.title || "",
      posterUrl: m.posterUrl || "",
      description: m.description || "",
      releaseDate: dateString,
      trailerLink: m.trailerLink || "",
      genre: m.genre || "",
      category: categoriesString,
    });
    setEditingMovieId(m._id);
    // Edit mode e gele auto movies tab e pathabo
    navigate("/admin/movies");
    window.scrollTo({ top: 0, behavior: "smooth" }); // form obdi automatically uthiye dbo as a good UI rule
  };

  // Edit theke Cancel e click kora
  const handleCancelEdit = () => {
    setFormData({
      title: "",
      posterUrl: "",
      description: "",
      releaseDate: "",
      trailerLink: "",
      genre: "",
      category: "",
    });
    setEditingMovieId(null);
  };

  // delete korar jonno ashirbad (confimation) lagbe then Delete call ta proceed lagbe API te.
  const handleDeleteMovie = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this movie? This action cannot be undone.",
      )
    ) {
      try {
        await axios.delete(`http://localhost:3000/api/movies/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // API delete marar por UI theke o line t kete uriye dchi locally fast feel er jono
        setMovies(movies.filter((m) => m._id !== id));
      } catch (error) {
        alert(error.response?.data?.message || "Error deleting movie");
      }
    }
  };

  // Step 6: Amra chaile kono kharap user ke block ban marte pai ..eta backend korbe ami sudu request dbo user list block button
  const handleBanUser = async (id) => {
    try {
      // Toggle backend theke value nbe
      const { data } = await axios.put(
        `http://localhost:3000/api/users/${id}/ban`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // Jei user id tar sathe kaj hocchlo shuduh tar ban value ta local view te change korchi .map er modhme
      setUsers(
        users.map((u) =>
          u._id === id ? { ...u, isBanned: data.isBanned } : u,
        ),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Error toggling ban");
    }
  };

  // Kono user i bhalo lagchena direct delete !
  const handleDeleteUser = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      try {
        await axios.delete(`http://localhost:3000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // ek e bhabe lokal UI te tar id badi baki list show koriye line uthai pelci
        setUsers(users.filter((u) => u._id !== id));
      } catch (error) {
        alert(error.response?.data?.message || "Error deleting user");
      }
    }
  };

  if (loading && !movies.length && !users.length) return <Loader />;

  return (
    <div className="admin-page">
      <h1>
        Admin Dashboard -{" "}
        {activeTab === "movies" ? "Manage Movies" : "Manage Users"}
      </h1>

      {/* Active tab movie taale ai block hobe show  */}
      {activeTab === "movies" && (
        <div className="admin-layout">
          {/* Create & Edit ghor form*/}
          <div className="admin-form-section glass">
            <h2>{editingMovieId ? "Edit Movie" : "Add New Movie"}</h2>
            <form onSubmit={handleMovieSubmit} className="admin-form">
              <input
                type="text"
                name="title"
                className="input-field"
                placeholder="Movie Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <input
                type="url"
                name="posterUrl"
                className="input-field"
                placeholder="Poster Image URL"
                value={formData.posterUrl}
                onChange={handleChange}
              />
              <textarea
                name="description"
                className="input-field"
                rows="4"
                placeholder="Movie Description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>

              <div className="form-row">
                <input
                  type="date"
                  name="releaseDate"
                  className="input-field"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  title="Release Date"
                />
                <input
                  type="text"
                  name="genre"
                  className="input-field"
                  placeholder="Genre (e.g., Action)"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                type="url"
                name="trailerLink"
                className="input-field"
                placeholder="YouTube Trailer URL"
                value={formData.trailerLink}
                onChange={handleChange}
              />
              <input
                type="text"
                name="category"
                className="input-field"
                placeholder="Categories (comma separated: Movies, Trending)"
                value={formData.category}
                onChange={handleChange}
                required
              />

              <div
                className="form-actions"
                style={{ display: "flex", gap: "10px", marginTop: "10px" }}
              >
                <button
                  type="submit"
                  className="btn"
                  style={{ flex: 1 }}
                  disabled={formLoading}
                >
                  {formLoading
                    ? "Saving..."
                    : editingMovieId
                      ? "Update Movie"
                      : "Add Movie"}
                </button>
                {/* jodi editing chole (not add new), tahole pashe cross ba cancel r oopton thek */}
                {editingMovieId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Table Of items jethne List Dekhabe  */}
          <div className="admin-list-section glass">
            <h2>Manage Movies ({movies?.length || 0})</h2>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Categories</th>
                    <th>Genre</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Step 7: Local Array ke loop korchi table roow er tr td a   */}
                  {movies?.map((movie) => (
                    <tr key={movie._id}>
                      <td className="truncate" title={movie.title}>
                        {movie.title}
                      </td>
                      <td>
                        {(() => {
                          if (movie.category && movie.category.join) {
                            return movie.category.join(", ");
                          } else if (movie.category) {
                            return movie.category;
                          } else {
                            return "";
                          }
                        })()}
                      </td>
                      <td>{movie.genre}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEditClick(movie)}
                            className="btn-edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMovie(movie._id)}
                            className="btn-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!movies || movies.length === 0) && (
                    <tr>
                      <td
                        colSpan="4"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No movies found. Add some!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Jodi Active tabs users hoy, tahole onno div layout ..  */}
      {activeTab === "users" && (
        <div className="admin-layout" style={{ display: "block" }}>
          <div className="admin-list-section glass">
            <h2>Manage Users ({users?.length || 0})</h2>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.isAdmin ? "Admin" : "User"}</td>
                      <td>
                        <span
                          style={{
                            color: u.isBanned ? "red" : "green",
                            fontWeight: "bold",
                          }}
                        >
                          {u.isBanned ? "Banned" : "Active"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {/* Admin nijer upore ban ba delete action run krte parene na tai seai condition chapa disabled thke. */}
                          <button
                            onClick={() => handleBanUser(u._id)}
                            className={u.isBanned ? "btn-edit" : "btn-delete"}
                            disabled={u.isAdmin}
                          >
                            {u.isBanned ? "Unban" : "Ban"}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="btn-delete"
                            disabled={u.isAdmin}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!users || users.length === 0) && (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
