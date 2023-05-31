document.getElementById('authorizeButton').addEventListener('click', initiateAuthorization);

// Following instructions from: https://lichess.org/api#tag/OAuth/operation/oauth

// Step 1: Generate random strings
function generateRandomString(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset.charAt(randomIndex);
    }
    return result;
  }
  
  // Step 2: Initiate authorization request
  function initiateAuthorization() {
    const codeVerifier = generateRandomString(32);
    const state = generateRandomString(16);
  
    // Save codeVerifier and state in session storage
    sessionStorage.setItem('codeVerifier', codeVerifier);
    sessionStorage.setItem('state', state);
  
    // Redirect user to authorization endpoint
    const redirectUri = 'https://jackbullen.github.io/Lichess-Puzzles/';
    const authorizationUrl = `https://lichess.org/oauth?client_id=your-client-id&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&code_challenge_method=S256&code_challenge=${encodeURIComponent(codeVerifier)}&state=${encodeURIComponent(state)}`;
    window.location.href = authorizationUrl;
  }
  
  // Step 3: Handle authorization callback
  function handleAuthorizationCallback() {
    // Extract the returned query parameters from the URL
    const params = new URLSearchParams(window.location.search);
    const returnedCode = params.get('code');
    const returnedState = params.get('state');
  
    // Retrieve the stored codeVerifier and state from session storage
    const storedCodeVerifier = sessionStorage.getItem('codeVerifier');
    const storedState = sessionStorage.getItem('state');
  
    // Verify that the returned state matches the stored state
    if (returnedState !== storedState) {
      console.error('State mismatch. Possible CSRF attack!');
      return;
    }
  
    // Perform the token exchange request using the returned authorization code
    const tokenEndpoint = 'https://lichess.org/api/token';
    const requestBody = {
      grant_type: 'authorization_code',
      code: returnedCode,
      code_verifier: storedCodeVerifier,
      redirect_uri: 'https://your-redirect-uri.com',
      client_id: 'your-client-id'
    };
  
    fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(requestBody)
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response data containing the access token
        console.log(data.access_token);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  