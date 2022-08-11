const newPostHandler = async (event) => {
    event.preventDefault();
  
    const title = document.querySelector('#post-title-input').value.trim();
    const contents = document.querySelector('#post-contents-input').value.trim();
  
    if (title  && contents) {
      const response = await fetch(`/api/posts`, {
        method: 'PUT',
        body: JSON.stringify({ title, contents }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert('Failed to edit post');
      }
    }
  };
  
  document
  .querySelector('.edit-post-form')
  .addEventListener('submit', newPostHandler);