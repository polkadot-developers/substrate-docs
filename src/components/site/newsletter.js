import React, { useState } from 'react';

import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { Link } from '../default/Link';

export default function Newsletter() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { siteMetadata } = useSiteMetadata();

  const handleSubmit = event => {
    event.preventDefault();
    const data = new FormData(event.target);
    fetch('https://paritytechnologies.activehosted.com/proc.php', {
      method: 'POST',
      body: data,
      mode: 'no-cors',
    })
      .then(response => {
        console.log(response);
        setFormSubmitted(!formSubmitted);
        setTimeout(() => {
          setFormSubmitted(false);
        }, 5000);
      })
      .catch(error => console.log('Request failed', error));
  };

  return (
    <>
      {!formSubmitted && (
        <div className="w-full">
          <h2 className="text-4xl font-bold mb-4">Newsletter</h2>
          <p className="font-bold text-lg">
            Subscribe for the latest news, technical updates and helpful developer resources.
          </p>
          <form onSubmit={event => handleSubmit(event)}>
            <input type="hidden" name="u" value="11" />
            <input type="hidden" name="f" value="11" />
            <input type="hidden" name="s" />
            <input type="hidden" name="c" value="0" />
            <input type="hidden" name="m" value="0" />
            <input type="hidden" name="act" value="sub" />
            <input type="hidden" name="v" value="2" />
            <div>
              <input
                className="w-full h-16 flex-1 mb-6 border-3 rounded-lg border-black dark:bg-substrateDarkest dark:border-substrateGray-dark dark:placeholder-white text-bodyBg text-xl p-4 focus:outline-none hover:ring-2 focus:ring-2 text-center"
                type="email"
                name="email"
                placeholder="Email Address"
                required
              />
              <button
                className="w-full bg-substrateGreen hover:bg-white text-white hover:text-substrateGreen align-items mb-6 px-9 py-4 text-xl font-bold transition duration-200 focus:outline-none focus:ring-2 rounded-lg border-3 border-substrateGreen"
                type="submit"
                value="Submit"
                onSubmit={event => handleSubmit(event)}
              >
                Subscribe
              </button>
            </div>
            <p className="text-sm">
              To see how we use your information please see our{' '}
              <span className="underline-animate underline-animate-thin">
                <Link to="https://www.parity.io/privacy/">privacy policy</Link>
              </span>
            </p>
          </form>
        </div>
      )}
      {formSubmitted && (
        <div className="w-full">
          <h2 className="text-4xl font-bold mb-4">Almost finished...</h2>
          <p className="font-bold text-lg">
            To complete the subscription process, please click the link in the email we just sent you.
          </p>
          <p className="text-sm">
            For more news, follow{' '}
            <span className="underline-animate underline-animate-thin">
              <Link to={siteMetadata.twitter}>@substrate_io</Link>
            </span>{' '}
            on Twitter.
          </p>
        </div>
      )}
    </>
  );
}
