import "./Transactions.css";

const Transactions = () => {
  return (
    <>
      <div className="transactions-header">
        <h1>SVE TRANSAKCIJE</h1>
        <a href="/admin/main">POCETNA STRANA</a>
      </div>
      <div className="transactions">
        <header>
          <p>subota, 10.jun 2023.</p>
        </header>
        <div className="goodsTransactions">
          <p>Stefan</p>
          <p>Roba: 2</p>
          <p>Cena: 1 din</p>
          <p>Kolicina: 1x</p>
          <p>Datum: 18.5.2023</p>
        </div>
        <div className="paymentTransactions">
          <p>Dejan Markovic</p>
          <p>Uplata</p>
          <p>-50000 din</p>
          <p>Datum: 15.3.2023</p>
        </div>
        <footer>
          <p>Dug za ovaj Dan: 61735</p>
        </footer>
      </div>
    </>
  );
};

export default Transactions;
