  const curtainMenu = document.getElementById('curtain-menu');
  const menuButton = document.getElementById('click');
  const closeMenuButton = document.getElementById('close-menu');

  menuButton.addEventListener('click', (event) => {
    event.preventDefault();
    curtainMenu.classList.toggle('open');
  });

  closeMenuButton.addEventListener('click', () => {
    curtainMenu.classList.remove('open');
  });
  
  
  
  
  
  
  
  
  
  
  
  