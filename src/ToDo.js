/* eslint-disable no-useless-constructor */
import React from "react";
import "./ToDo.css";

// なにもないときのテキスト OK
// isDoneを消すやつOK
// Deleteのファビコンを押したときに認識されてない。Edit機能なくせばすぐできそう。
//Deleteができてない。 OK
// keyをindexにしているが、これだと整理やソートできない
// Date.now()をつかっている  OK
// deleteボタン OK
// Controller周り
// Container完了関係 OKスタイリングまだ（doneContainerを
// 消したためfilterでソートしたりスタイリング必要 OK

class ToDo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      todoList: [],
      showDescription: false,
      showStatus: "showAll", //["showAll", "showActive", "showDone"]
    };
    // bind section
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  // Enterで追加用。addToDoで処理
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }
  handleKeyDown(e) {
    if (e.key === "Enter") {
      this.addToDo();
    }
  }
  handleDescriptionClick() {
    this.setState((state) => {
      return {
        showDescription: !state.showDescription,
      };
    });
  }
  addToDo(e) {
    const state = this.state;
    const todoObj = {
      value: state.input,
      isDone: false,
      key: Date.now().toString(),
    };
    this.setState({
      input: "",
      todoList: [...state.todoList, todoObj],
    });
  }
  handleInputChange(e) {
    this.setState((state) => {
      return {
        input: e.target.value,
      };
    });
  }
  clearForm(e) {
    this.setState((state) => {
      return {
        input: "",
      };
    });
  }
  handleToDoClick(e) {
    const target = e.target;
    const index = this.state.todoList.findIndex((todo) => {
      return todo.key === e.currentTarget.id;
    });
    let newToDoList = [...this.state.todoList];
    // DeleteBtn Iはファビコン
    if (target.id === "deleteBtn" || target.className === "fa fa-close") {
      let modifiedToDoList = newToDoList.slice();
      let deletedToDo = modifiedToDoList.splice(index, 1);
      this.setState((state) => {
        return {
          todoList: modifiedToDoList,
        };
      });
    } else {
      newToDoList[index].isDone = !newToDoList[index].isDone;
      this.setState((state) => {
        return {
          todoList: newToDoList,
        };
      });
    }
  }
  handleShowStatusClick(e) {
    const instructionID = e.target.id;
    const showStatus = this.state.showStatus;
    if (instructionID.match(/showAll|showActive|showDone/)) {
      this.setState((state) => {
        return {
          showStatus: instructionID,
        };
      });
    }
  }
  eliminateDone() {
    this.setState((state) => {
      return {
        todoList: state.todoList.filter((todo) => {
          return !todo.isDone;
        }),
      };
    });
  }

  render() {
    // categorize done or undone with map
    let modifiedToDoList = this.state.todoList.slice();
    if (this.state.showStatus === "showActive") {
      modifiedToDoList = modifiedToDoList.filter((todo) => {
        return !todo.isDone;
      });
    } else if (this.state.showStatus === "showDone") {
      modifiedToDoList = modifiedToDoList.filter((todo) => {
        return todo.isDone;
      });
    } else {
      // isDone===trueを後ろにする
      modifiedToDoList.sort((fE, sE) => {
        // sE未完 => fE完
        if (fE.isDone > sE.isDone) {
          return 1;
          // fE未完 => sE完
        } else if (fE.isDone < sE.isDone) {
          return -1;
        }
        return 0;
      });
    }

    return (
      <div id="todoWrapper">
        <Header
          onDescriptionClick={this.handleDescriptionClick.bind(this)}
          showDescription={this.state.showDescription}
        />
        <Generator
          inputValue={this.state.input}
          onInputChange={this.handleInputChange.bind(this)}
          addToDo={this.addToDo.bind(this)}
          clearForm={this.clearForm.bind(this)}
        />
        <Controller
          handleShowStatusClick={this.handleShowStatusClick.bind(this)}
          eliminateDone={this.eliminateDone.bind(this)}
        />
        <Container
          todoList={modifiedToDoList}
          handleToDoClick={this.handleToDoClick.bind(this)}
        />
      </div>
    );
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="headerWrapper">
        <header>
          <h1 id="title">React-To-Do</h1>
          <nav id="headerNav">
            <ul>
              <li
                className="DrowingButton"
                onClick={this.props.onDescriptionClick}
              >
                <i className="fa fa-info-circle "></i>
                <div className="headerNavDetail">このアプリについて</div>
              </li>
            </ul>
          </nav>
        </header>
        <Description
          style={{
            display: this.props.showDescription ? "block" : "none",
          }}
        />
      </div>
    );
  }
}
class Description extends React.Component {
  render() {
    return (
      <div id="description" style={this.props.style}>
        <div>
          Flex-To-Doは簡潔でわかりやすさを徹底してつくられたリマインダーアプリです。
          <br />
          著者： <em>YukiYama</em>
        </div>
        <div>
          <h2>このアプリの特徴</h2>
          いたってシンプルなタスク管理アプリで、以下の機能を持ちます。
          <ul>
            <li>EnterキーによるToDoの追加(PCのみ)</li>
            <li>入力欄への自動フォーカス</li>
            <li>ToDoの表示切り替え</li>
          </ul>
        </div>
      </div>
    );
  }
}
class Generator extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="todoGenerator">
        <input
          type="text"
          value={this.props.inputValue}
          onChange={this.props.onInputChange}
        />
        <button id="ctdAdd" onClick={this.props.addToDo}>
          追加
        </button>
        <button id="clearFormBtn" onClick={this.props.clearForm}>
          クリア
        </button>
      </div>
    );
  }
}
class Container extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log(this.props.todoList);
    return (
      <ul id="container">
        {this.props.todoList.length ? (
          this.props.todoList.map((todo, i) => (
            <li
              className="todoElement"
              key={todo.key}
              // in order to glab key value
              id={todo.key}
              isdone={todo.isDone.toString()}
              onClick={this.props.handleToDoClick}
            >
              <input
                type="checkbox"
                checked={todo.isDone ? true : false}
                readOnly
              />
              <span>{todo.value ? todo.value : "名無しのToDo"}</span>
              <button id="deleteBtn">
                <i className="fa fa-close" />
              </button>
            </li>
          ))
        ) : (
          <li>表示するToDoがありません。</li>
        )}
      </ul>
    );
  }
}
class Controller extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="todoController">
        <ul id="showStatus" onClick={this.props.handleShowStatusClick}>
          <li id="showAll">すべて</li>
          <li id="showActive">未完のみ</li>
          <li id="showDone">完了のみ</li>
        </ul>
        <div id="clearDone" onClick={this.props.eliminateDone}>
          完了したものを消す
        </div>
      </div>
    );
  }
}

export { ToDo };
