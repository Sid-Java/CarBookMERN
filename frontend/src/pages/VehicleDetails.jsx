import React from 'react';

const VehicleDetails = () => (
  <div className="container fade-in">
    <div className="card text-center">
      {/* Vehicle image */}
      <div className="circle" style={{ width: 120, height: 120, background: 'var(--overlay-2)', margin: '0 auto' }}></div>
      <h2 className="gradient-text mt-2">Vehicle Name</h2>
      <p>Type: Car <span className="icon">🚗</span></p>
      <p>Brand: Tata</p>
      <p>Price: ₹1000/day</p>
      <button className="button mt-2">Book Now</button>
    </div>
  </div>
);

export default VehicleDetails; 