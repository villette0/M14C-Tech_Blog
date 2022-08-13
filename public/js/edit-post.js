const newPostHandler = async (event) => {
    event.preventDefault();
  
    const title = document.querySelector('#post-title-input').value.trim();
    const contents = document.querySelector('#post-contents-input').value.trim();
    const postId = document.querySelector('.edit-post-form').getAttribute('data-post-id');
  
    if (title  && contents) {
      console.log(postId);
      const response = await fetch(`/api/posts/${postId}`, {
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