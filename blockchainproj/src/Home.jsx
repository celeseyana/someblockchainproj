// App.jsx
import 'bulma/css/bulma.min.css';

export default function App() {

  return (
    <div className="section">
      <div className="container">
        <div className="mb-5">
          <h1 className="title is-4">IBM FoodTrust Clone</h1>
          <p className="subtitle is-6">
            <strong>Trace scenario:</strong> Mesclun salad mix (02381331323554) · Lot: BNT102256
          </p>
        </div>

        {/* 🔹 STATIC PLACEHOLDER CARDS */}
        <div className="box mb-5">
          <p className="has-text-grey-light">[Timeline Visualization Placeholder]</p>
        </div>

        <div className="columns is-multiline">
          <div className="column is-one-quarter">
            <div className="box">
              <p className="title is-5">Producers</p>
              <p className="subtitle is-6">26</p>
              <p className="has-text-grey">Bulk unwashed kale</p>
              <p className="has-text-grey-light is-size-7">10 Farms</p>
            </div>
          </div>

          <div className="column is-one-quarter">
            <div className="box">
              <p className="title is-5">Packing House</p>
              <p className="subtitle is-6">6</p>
              <p className="has-text-grey">Fresh Produce Inc.</p>
              <p className="has-text-grey-light is-size-7">Baby kale 50 lbs</p>
            </div>
          </div>

          <div className="column is-one-quarter">
            <div className="box">
              <p className="title is-5">Manufacturing Plant</p>
              <p className="subtitle is-6">2</p>
              <p className="has-text-grey">Mesclun salad mix</p>
              <p className="has-text-grey-light is-size-7">2 plants</p>
            </div>
          </div>

          <div className="column is-one-quarter">
            <div className="box">
              <p className="title is-5">Distribution Center</p>
              <p className="subtitle is-6">10</p>
              <p className="has-text-grey">Super Store Inc.</p>
              <p className="has-text-grey-light is-size-7">5 DCs</p>
            </div>
          </div>

          <div className="column is-one-quarter">
            <div className="box">
              <p className="title is-5">Store</p>
              <p className="subtitle is-6">356</p>
              <p className="has-text-grey">Super Store Inc.</p>
              <p className="has-text-grey-light is-size-7">234 Stores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
