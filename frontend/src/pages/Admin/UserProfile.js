import { useParams } from "react-router-dom";

import "./UserProfile.css";

const UserProfile = (props) => {
  const { username } = useParams();

  return (
    <>
      <h1>Korisnik: {username}</h1>
      <h1>Stanje: 30258 din</h1>
      <form className="goodsForm">
        <div>
          <label>Roba</label>
          <input type="text" required></input>
        </div>
        <div>
          <label>Kolicina</label>
          <input type="number" required></input>
        </div>
        <div>
          <label>Cena</label>
          <input type="number" required></input>
        </div>
        <button type="submit">Potvrdi</button>
      </form>
      <form className="paymentForm">
        <div>
          <label>Uplata</label>
          <input type="number" required></input>
        </div>
        <div>
          <label>Dodatne informacije</label>
          <input></input>
        </div>
        <button type="submit">Potvrdi</button>
      </form>
      <div className="hrefs">
        <a className="main-page" href="/admin/main">
          MAIN PAGE
        </a>
        <form className="deleteForm">
          <button className="delete-profile">OBRISI PROFIL</button>
        </form>
        <a className="all-transactions" href="/admin/transactions">
          SVE TRANSAKCIJE
        </a>
      </div>
      <div className="user-transactions">
        <header>
          <p>subota, 10.jun 2023.</p>
        </header>
        <div className="goodsUserTransaction">
          <p>Roba: 2</p>
          <p>Cena: 1 din</p>
          <p>Kolicina: 1x</p>
          <p>Dug: 1 din</p>
          <button>OBRISI</button>
        </div>
        <div className="paymentUserTransaction">
          <p>Uplata</p>
          <p></p>
          <p>-50000 din</p>
          <p></p>
          <button>OBRISI</button>
        </div>
        <footer>
          <p>Dug za ovaj Dan: 61735</p>
        </footer>
      </div>
    </>
  );
};

export default UserProfile;
