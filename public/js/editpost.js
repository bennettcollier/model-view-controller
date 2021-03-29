async function editFormHandler(event){
    event.preventDefault();
    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];

    const title = document.querySelector('input[name="post-title"]').value;
    const textbody = document.querySelector('textarea[name="textbody"]').value;

    resp = await fetch(`/api/posts/${post_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            title,
            textbody
        }),
        headers: {
            'Content-Type': 'application/json'
        }
        });
    if(resp.ok){
        
        document.location.replace('/dashboard/')  
    } else {
        alert(resp.statusText);
    }    
}

document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);