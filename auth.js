// auth.js - Client-side authentication handling
document.addEventListener('DOMContentLoaded', () => {
  const supabase = window.supabase.createClient(
    'https://wqxlakambzrebifqszbo.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxeGxha2FtYnpyZWJpZnFzemJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxOTAzMjcsImV4cCI6MjA1OTc2NjMyN30.kIEpEt84s5sRAPmaN7Vb2oQCnXIHnKVxPFXD5gDqNuQ'
  );

  // Check authentication status on page load
  checkAuthStatus();

  // Handle form submission
  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.addEventListener('submit', handleAuthSubmit);
  }

  // Handle Google Sign-In
  if (document.getElementById('gSignInDiv')) {
    initializeGoogleSignIn();
  }
});

// Check if user is authenticated
async function checkAuthStatus() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session && window.location.pathname.includes('auth.html')) {
      // Redirect to dashboard if authenticated
      window.location.href = '/index.html';
    } else if (!session && !window.location.pathname.includes('auth.html')) {
      // Redirect to auth page if not authenticated
      window.location.href = '/auth.html';
    }
  } catch (error) {
    console.error('Auth check error:', error);
  }
}

// Handle form submission (login/signup)
async function handleAuthSubmit(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const fullname = document.getElementById('fullname')?.value;
  const role = document.getElementById('role')?.value;
  const mode = document.getElementById('form-title').textContent.includes('Sign In') ? 'login' : 'signup';

  try {
    if (mode === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      redirectToDashboard(data);
    } else {
      if (!fullname || !role) {
        throw new Error('Full name and role are required');
      }
      
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      // Store additional user data
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ email, fullname, role }]);
      
      if (insertError) throw insertError;
      redirectToDashboard(data);
    }
  } catch (error) {
    alert(`Authentication failed: ${error.message}`);
    console.error('Auth error:', error);
  }
}

// Initialize Google Sign-In
function initializeGoogleSignIn() {
  google.accounts.id.initialize({
    client_id: '1047818163471-vdijksv0ta6f0u1msu2e8gvd792097fi.apps.googleusercontent.com',
    callback: handleGoogleSignIn
  });
  
  google.accounts.id.renderButton(
    document.getElementById('gSignInDiv'), 
    { theme: 'outline', size: 'large' }
  );
}

// Handle Google Sign-In callback
async function handleGoogleSignIn(response) {
  try {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential
    });
    
    if (error) throw error;
    
    // Check if user exists in your users table
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('email', data.user.email)
      .single();
    
    if (!userData) {
      // Create user record if doesn't exist
      await supabase.from('users').insert([{
        email: data.user.email,
        fullname: data.user.user_metadata?.full_name || '',
        role: 'user'
      }]);
    }
    
    redirectToDashboard(data);
  } catch (error) {
    alert('Google sign-in failed');
    console.error('Google auth error:', error);
  }
}

// Redirect to dashboard with session
function redirectToDashboard(authData) {
  localStorage.setItem('kyro_user', JSON.stringify(authData.user));
  window.location.href = '/index.html';
}

// Dashboard protection (add this to dashboard pages)
function protectDashboard() {
  const userData = localStorage.getItem('kyro_user');
  
  if (!userData) {
    window.location.href = '/auth.html';
    return;
  }
  
  // Verify session is still valid
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) {
      localStorage.removeItem('kyro_user');
      window.location.href = '/auth.html';
    } else {
      // Render protected content
      document.dispatchEvent(new Event('user-authenticated'));
    }
  });
}

// Logout function
async function logout() {
  try {
    await supabase.auth.signOut();
    localStorage.removeItem('kyro_user');
    window.location.href = '/auth.html';
  } catch (error) {
    console.error('Logout error:', error);
  }
}