const saveCommentHandler = async (event) => {
  const comment = document.querySelector("#blog_comment").value.trim();

  if (comment && event.target.hasAttribute("data-id")) {
    const blog_id = event.target.getAttribute("data-id");

    const response = await fetch(`/api/blogs/comment`, {
      method: "POST",
      body: JSON.stringify({ comment, blog_id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      document.location.replace(`/blogs/${blog_id}`);
    } else {
      const data = await response.json();
      alert(data.message);
    }
  }
};

document
  .querySelector("#saveCommentBtn")
  .addEventListener("click", saveCommentHandler);
