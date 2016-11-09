import React from 'react'
import ReactDOM from 'react-dom'

/* ----- Data Array For Posts & Comments ----- */
var DATA = [
  {
    id: 1,
    post: 'This is an example post so you can see what it would look like to have one.',
    comments: [
      'This is an example comment.',
    ]
  },
];

var nextId = 2;

/* ----------------------------------- */
/* ----- Main Application Module ----- */
/* ----------------------------------- */
var Application = React.createClass({
  propTypes: {
    initialData: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      post: React.PropTypes.string.isRequired,
      comments: React.PropTypes.array.isRequired,
    })).isRequired,
  },
  getInitialState: function() {
    return {
      data: this.props.initialData,
    }
  },
  /* ----- Removes Post When Remove Is Clicked (See Post Module) ----- */
  removePost: function(index) {
    this.state.data.splice(index, 1);
    this.setState(this.state);
  },
  /* ----- Edits Post When Edit Is Clicked (See Post Module) ----- */
  editPost: function(editedText, index) {
    this.state.data[index].post = editedText;
    this.setState(this.state);
  },
  /* ----- Add Post When Post Is Clicked (See Post Module) ----- */
  addPost: function(post) {
    this.state.data.push({
      id: nextId,
      post: post,
      comments: [],
    });
    this.setState(this.state);
    nextId += 1;
  },
  /* ----- Renders Application Module ----- */
  render: function() {
    return (
        <div>
          <WritePostBox addPostProp={this.addPost} />
          {this.state.data.map(function(data, index) {
            return (
              <Post
                key={data.id}
                post={data.post}
                comments={data.comments}
                id={data.id}
                editPostProp={this.editPost}
                removePostProp={this.removePost}
                indexProp={index} />
            );
          }.bind(this))}
        </div>
    );
  }
});


/* ------------------------------- */
/* ----- Write A Post Module ----- */
/* ------------------------------- */
var WritePostBox = React.createClass({
  /* ----- Gets Value From Post Form & Sends To Application ----- */
  post: function() {
    this.props.addPostProp(this.refs.addedText.value);
    this.refs.addedText.value = '';
  },
  /* ----- Renders Write A Post Module ----- */
  render: function() {
    return (
      <div className="write-post-box">
        <div className="write-post-content">
          <div className="profile-picture">
            <img src="img/josh.jpg" />
          </div>
          <div className="write-post-text">
            <div className="text-area">
              <textarea ref="addedText" className="write-post-text-input" placeholder="Write a post!"></textarea>
            </div>
          </div>
        </div>
        <div className="write-post-button">
          <button onClick={this.post}>Post</button>
        </div>
      </div>
    );
  }
});


/* ----------------------- */
/* ----- Post Module ----- */
/* ----------------------- */
var Post = React.createClass({
  propTypes: {
    post: React.PropTypes.string.isRequired,
    comments: React.PropTypes.array.isRequired,
    id: React.PropTypes.number.isRequired,
  },
  getInitialState: function() {
    return {
      comment: this.props.comments,
      editing: false,
      show: true,
      elapsedTime: 0,
      postTime: Date.now(),
    }
  },
  /* ----- Removes Post ----- */
  remove: function() {
    this.props.removePostProp(this.props.indexProp);
  },
  /* ----- Edits Post ----- */
  edit: function() {
    this.setState({editing: true});
  },
  /* ----- Saves Post ----- */
  save: function() {
    this.props.editPostProp(this.refs.editedText.value, this.props.indexProp);
    this.setState({editing: false});
  },
  /* ----- Hides Write A Comment Module When Editing Comment (See Comment Module) ----- */
  hideCommentHandle: function() {
    this.setState({show: false});
  },
  /* ----- Shows Write A Comment Module When Saving Comment (See Comment Module) ----- */
  showCommentHandle: function() {
    this.setState({show: true});
  },
  /* ----- Comments For Post ----- */
  postComments: function(data, index) {
      return (
        <CommentBox
          key={index}
          comments={data}
          removeCommentProp={this.removeComment}
          editCommentProp={this.editComment}
          indexProp={index}
          onEditClick={this.hideCommentHandle}
          onSaveClick={this.showCommentHandle}
           />
      );
  },
  /* ----- Adds Comment When Post Is Clicked (See Comment Module) ----- */
  addComment: function(post) {
    this.state.comment.push(post);
    this.setState(this.state);
  },
  /* ----- Removes Comment When Delete Is Clicked (See Comment Module) ----- */
  removeComment: function(index) {
    this.state.comment.splice(index, 1);
    this.setState(this.state);
  },
  /* ----- Edits Comment When Edit Is Clicked (See Comment Module) ----- */
  editComment: function(editedText, index) {
    this.state.comment[index] = editedText;
    this.setState(this.state);
  },
  componentDidMount: function() {
   this.interval = setInterval(this.postTime, 100);
  },
  componentWillUnmount: function() {
   clearInterval(this.interval);
  },
  /* ----- Time Of Post ----- */
  postTime: function() {
    var now = Date.now();
    this.setState({
      postTime: now,
      elapsedTime: this.state.elapsedTime + (now - this.state.postTime),
    });
  },
  /* ----- Time Converter Function ----- */
  timeSincePost: function() {
    var seconds = Math.floor(this.state.elapsedTime / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    if (minutes < 1) {
      return 'Just now';
    } else {
      if (minutes >= 1 && minutes < 2) {
        return minutes + ' min'
      } else {
        if (minutes >= 2 && minutes < 60) {
          return minutes + ' mins'
        } else {
          if (hours >= 1 && hours < 2) {
            return hours + ' hour'
          } else {
            if (hours >= 2 && hours < 24) {
              return hours + ' hours'
            } else {
              if (days >= 1 && days < 2) {
                return days + ' day'
              } else {
                if (days >= 2) {
                  return days + ' days'
                }
              }
            }
          }
        }
      }
    }
  },
  /* ----- Normal Post Render JSX ----- */
  renderNormal: function() {
    return (
      <div className="post">
        <div className="post-box">
          <div className="post-content">
            <div className="profile-picture">
              <img src="img/josh.jpg" />
            </div>
            <div className="post-info">
              <div className="user-name">
                <span className="name">Josh Dunn</span>
              </div>
              <div className="posted-time">
                <span>{this.timeSincePost()}</span>
              </div>
            </div>
          </div>
          <div className="post-text">
            <p>{this.props.post}</p>
          </div>
          <div className="post-button">
            <button onClick={this.remove}>Remove</button><button onClick={this.edit}>Edit</button>
          </div>
        </div>
        {this.state.comment.map(this.postComments)}
        {(this.state.show) ? <WriteCommentBox addCommentProp={this.addComment} /> : <div className="padding-fix"></div> }
      </div>
    );
  },
  /* ----- Edited Post Render JSX ----- */
  renderEdit: function() {
    return (
      <div className="post">
        <div className="post-box">
          <div className="write-post-content">
            <div className="profile-picture">
              <img src="img/josh.jpg" />
            </div>
            <div className="write-post-text">
              <div className="text-area">
                <textarea ref="editedText" className="write-post-text-input" defaultValue={this.props.post}></textarea>
              </div>
            </div>
          </div>
          <div className="write-post-button">
            <button onClick={this.save}>Save</button>
          </div>
        </div>
        {this.state.comment.map(this.postComments)}
        {(this.state.show) ? <WriteCommentBox addCommentProp={this.addComment} /> : <div className="padding-fix"></div> }
      </div>
    );
  },
  /* ----- Renders Post Module If Normal Or Editing ----- */
  render: function() {
    if(this.state.editing) {
      return this.renderEdit();
    } else {
      return this.renderNormal();
    }
  }
});


/* -------------------------- */
/* ----- Comment Module ----- */
/* -------------------------- */
var CommentBox = React.createClass({
  getInitialState: function() {
    return {
      editing: false,
      elapsedTime: 0,
      commentTime: Date.now(),
    }
  },
  /* ----- Removes Comment ----- */
  remove: function(event) {
    event.preventDefault();
    this.props.removeCommentProp(this.props.indexProp);
  },
  /* ----- Edits Comment ----- */
  edit: function() {
    this.setState({editing: true});
  },
  /* ----- Saves Comment ----- */
  save: function() {
    this.props.editCommentProp(this.refs.editedComment.value, this.props.indexProp);
    this.setState({editing: false});
  },
  /* ----- Gathers Edit Click Data & Sends To Post Module ----- */
  onEditClick: function(event) {
    event.preventDefault();
    this.edit();
    this.props.onEditClick();
  },
  /* ----- Gathers Save Click Data & Sends To Post Module ----- */
  onSaveClick: function(event) {
    this.save();
    this.props.onSaveClick();
  },
  componentDidMount: function() {
   this.interval = setInterval(this.commentTime, 100);
  },
  componentWillUnmount: function() {
   clearInterval(this.interval);
  },
  /* ----- Time Of Post ----- */
  commentTime: function() {
    var now = Date.now();
    this.setState({
      commentTime: now,
      elapsedTime: this.state.elapsedTime + (now - this.state.commentTime),
    });
  },
  /* ----- Time Converter Function ----- */
  timeSinceComment: function() {
    var seconds = Math.floor(this.state.elapsedTime / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    if (minutes < 1) {
      return 'Just now';
    } else {
      if (minutes >= 1 && minutes < 2) {
        return minutes + ' min'
      } else {
        if (minutes >= 2 && minutes < 60) {
          return minutes + ' mins'
        } else {
          if (hours >= 1 && hours < 2) {
            return hours + ' hour'
          } else {
            if (hours >= 2 && hours < 24) {
              return hours + ' hours'
            } else {
              if (days >= 1 && days < 2) {
                return days + ' day'
              } else {
                if (days >= 2) {
                  return days + ' days'
                }
              }
            }
          }
        }
      }
    }
  },
  /* ----- Normal Post Render JSX ----- */
  renderNormal: function() {
    return (
      <div className="comment-box">
        <div className="comment-content clearfix">
          <div className="comment-profile-picture">
            <img src="img/josh.jpg" />
          </div>
          <div className="comment-info">
            <div className="user-name">
              <span className="name">Josh Dunn</span>
              <span className="comment">{this.props.comments}</span>
            </div>
            <div className="posted-time">
              <a href="#"><span className="edit-comment" onClick={this.onEditClick}>Edit</span></a><a href="#"><span className="remove-comment" onClick={this.remove}>Delete</span></a><span className="time"> - {this.timeSinceComment()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
  /* ----- Edited Comment Render JSX ----- */
  renderEdit: function() {
    return (
      <div className="comment-box">
        <div className="write-comment-content clearfix">
          <div className="write-comment-profile-picture">
            <img src="img/josh.jpg" />
          </div>
          <div className="write-comment-info">
            <textarea ref="editedComment" className="write-comment-text-input" defaultValue={this.props.comments}></textarea>
            <div className="write-comment-button">
              <button onClick={this.onSaveClick}>Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  },
  /* ----- Renders Comment Module If Normal Or Editing ----- */
  render: function() {
    if(this.state.editing) {
      return this.renderEdit();
    } else {
      return this.renderNormal();
    }
  }
});

/* ---------------------------------- */
/* ----- Write A Comment Module ----- */
/* ---------------------------------- */
var WriteCommentBox = React.createClass({
  /* ----- Gets Value From Post Form & Sends To Comment Module ----- */
  post: function() {
    this.props.addCommentProp(this.refs.addedText.value);
    this.refs.addedText.value = '';
  },
  /* ----- Renders Write A Comment Module ----- */
  render: function() {
    return (
      <div className="write-comment-box">
        <div className="write-comment-content clearfix">
          <div className="write-comment-profile-picture">
            <img src="img/josh.jpg" />
          </div>
          <div className="write-comment-info">
            <textarea ref="addedText" className="write-comment-text-input" placeholder="Write a comment!"></textarea>
            <div className="write-comment-button">
              <button onClick={this.post}>Post</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

/* ----- Renders Application Module To Page ----- */
ReactDOM.render(
  <Application initialData={DATA} />,
  document.getElementById('app')
);
