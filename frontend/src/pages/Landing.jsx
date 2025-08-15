import heroImage from '../assets/landing-hero.jpg'; 

export default function Landing() {
  return (
    <div className="max-w-6xl mx-auto py-16 flex items-center justify-between">
      
      {/*landing text*/}
      <div className="w-1/2 pr-8">
        <h1 className="text-5xl font-extrabold mb-6">
          Post projects. Get competitive bids. 
        </h1>
        <ul className="text-lg text-gray-600 space-y-3">
          <li>✔ Collaboration with top talent</li>
          <li>✔ Simple and transparent</li>
          <li>✔ Security and trust</li>
          <li>✔ Clear pricing and timelines</li>
        </ul>
      </div>

      
      <div className="w-1/2 flex justify-center">
        <img
          src={heroImage}
          alt="BidConnect platform preview"
          className="max-w-full h-auto rounded-lg shadow-lg"
        />
      </div>

    </div>
  );
}
