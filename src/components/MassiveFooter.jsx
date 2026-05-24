import React from 'react';

export default function MassiveFooter({ routeToContent }) {
  const handleLink = (e, topic) => {
    e.preventDefault();
    routeToContent(topic);
  };

  return (
    <div style={{
      marginTop: '64px',
      padding: '48px 32px',
      background: 'rgba(7, 10, 19, 0.95)',
      borderTop: '1px solid var(--border-glass)',
      borderBottom: '1px solid var(--border-glass)',
      borderRadius: '16px 16px 0 0',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '40px',
      color: 'var(--text-muted)'
    }}>
      
      {/* Column 1 */}
      <div>
        <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.05em' }}>Shop</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li><a href="#" onClick={(e) => handleLink(e, 'Used Cars')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Used Cars</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'New Cars')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>New Cars</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Certified Pre-Owned')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Certified Pre-Owned</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Cars for Sale by Owner')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Cars for Sale by Owner</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Find a Dealer')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Find a Dealer</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Pickup Trucks Buying Guide')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Pickup Trucks Buying Guide</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Electric Cars Buying Guide')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Electric Cars Buying Guide</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Financing')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Financing</a></li>
        </ul>
      </div>

      {/* Column 2 */}
      <div>
        <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.05em' }}>Research & News</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li><a href="#" onClick={(e) => handleLink(e, 'Consumer Car Reviews')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Consumer Car Reviews</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Car News & Expert Reviews')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Car News & Expert Reviews</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Compare Cars')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Compare Cars</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Best Cars Rankings')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Best Cars Rankings</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Safety & Recalls')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Safety & Recalls</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'American-Made Index')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>American-Made Index</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Video Reviews')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Video Reviews</a></li>
        </ul>

        <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 800, margin: '32px 0 16px 0', letterSpacing: '0.05em' }}>Sell</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li><a href="#" onClick={(e) => handleLink(e, 'Sell Your Car')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Sell Your Car</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Get Instant Offer')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Get Instant Offer</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Free Listing on Cars.com')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Free Listing on Cars.com</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Selling Guides & Tips')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Selling Guides & Tips</a></li>
        </ul>
      </div>

      {/* Column 3 */}
      <div>
        <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.05em' }}>Tools & Services</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li><a href="#" onClick={(e) => handleLink(e, 'Car Loan Calculators')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Car Loan Calculators</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Car Affordability Calculator')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Car Affordability Calculator</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Ship a Car')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Ship a Car</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Car Warranty')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Car Warranty</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Car Insurance')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Car Insurance</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Car Maintenance')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Car Maintenance</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Site Map')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Site Map</a></li>
        </ul>

        <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 800, margin: '32px 0 16px 0', letterSpacing: '0.05em' }}>For Dealers</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li><a href="#" onClick={(e) => handleLink(e, 'Explore Cars Commerce')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Explore Cars Commerce</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Log In To Your Platform')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Log In To Your Platform</a></li>
        </ul>
      </div>

      {/* Column 4 */}
      <div>
        <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.05em' }}>Popular Car Models</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li><strong style={{ color: 'var(--text-light)' }}>Toyota</strong></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Toyota RAV4')} style={{ color: 'inherit', textDecoration: 'none' }}>Toyota RAV4</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Toyota Prius')} style={{ color: 'inherit', textDecoration: 'none' }}>Toyota Prius</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Toyota Tacoma')} style={{ color: 'inherit', textDecoration: 'none' }}>Toyota Tacoma</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Toyota Camry')} style={{ color: 'inherit', textDecoration: 'none' }}>Toyota Camry</a></li>
          
          <li style={{ marginTop: '8px' }}><strong style={{ color: 'var(--text-light)' }}>Honda</strong></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Honda CR-V')} style={{ color: 'inherit', textDecoration: 'none' }}>Honda CR-V</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Honda Civic')} style={{ color: 'inherit', textDecoration: 'none' }}>Honda Civic</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Honda Accord')} style={{ color: 'inherit', textDecoration: 'none' }}>Honda Accord</a></li>
          
          <li style={{ marginTop: '8px' }}><strong style={{ color: 'var(--text-light)' }}>Ford</strong></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Ford F-150')} style={{ color: 'inherit', textDecoration: 'none' }}>Ford F-150</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Ford Bronco')} style={{ color: 'inherit', textDecoration: 'none' }}>Ford Bronco</a></li>
          
          <li style={{ marginTop: '8px' }}><strong style={{ color: 'var(--text-light)' }}>Jeep & Chevrolet</strong></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Jeep Wrangler')} style={{ color: 'inherit', textDecoration: 'none' }}>Jeep Wrangler</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Chevrolet Silverado')} style={{ color: 'inherit', textDecoration: 'none' }}>Chevrolet Silverado</a></li>
        </ul>
      </div>

      {/* Column 5 */}
      <div>
        <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.05em' }}>Top Metro Areas</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li><a href="#" onClick={(e) => handleLink(e, 'Chicago, IL')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Chicago, IL</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Houston, TX')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Houston, TX</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Los Angeles, CA')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Los Angeles, CA</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Phoenix, AZ')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Phoenix, AZ</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Atlanta, GA')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Atlanta, GA</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Philadelphia, PA')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Philadelphia, PA</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'New York, NY')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>New York, NY</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'San Diego, CA')} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>San Diego, CA</a></li>
        </ul>

        <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 800, margin: '32px 0 16px 0', letterSpacing: '0.05em' }}>About Cars.com</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
          <li><a href="#" onClick={(e) => handleLink(e, 'Contact Us')} style={{ color: 'inherit', textDecoration: 'none' }}>Contact Us</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Investor Relations')} style={{ color: 'inherit', textDecoration: 'none' }}>Investor Relations</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Careers')} style={{ color: 'inherit', textDecoration: 'none' }}>Careers</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Terms & Conditions of Use')} style={{ color: 'inherit', textDecoration: 'none' }}>Terms & Conditions of Use</a></li>
          <li><a href="#" onClick={(e) => handleLink(e, 'Privacy Notice')} style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Notice</a></li>
        </ul>
      </div>

    </div>
  );
}
