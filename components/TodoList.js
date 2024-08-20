import { useState } from "react";
import ListItem from "../components/ListItem";
import UnorderedList from "../components/UnorderedList";
import apiFetch from "../functions/apiFetch";
import Alert from "./Alert";

const TodoList = ({ todos, setTodos, loading, error }) => {
  //error state for when we toggle a todo as incomplete or complete
  const [mutationError, setMutationError] = useState("");

  //optimistically update the UI so that the experience feels faster for the user
  //we dont have to wait for the server to respond to the data mutation before updating the UI
  //however, if the mutation fails, we will revert the UI to the previous state
  const toggleCompleted = (todoID) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.todoID === todoID) return { ...todo, completed: !todo.completed };
        return todo;
      })
    );
  };

  const handleToggleComplete = async (todoID, completed, name) => {
    setMutationError("");
    //start the optimistic update
    toggleCompleted(todoID);
    try {
      const response = await apiFetch(`/todo/${todoID}`, {
        method: "PATCH",
        body: {
          completed,
        },
      });
      if (response.status !== 200) {
        throw new Error(`Failed to mark "${name}" as ${completed ? "incomplete" : "complete"}`);
      }
    } catch (e) {
      setMutationError(e.message);
      //revert the UI to the previous state if the mutation fails
      toggleCompleted(todoID);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <Alert message={error} />;
  }

  return (
    <div>
      <UnorderedList>
        {Boolean(todos?.length) ? (
          todos.map((todo) => (
            <ListItem key={todo.todoID}>
              <p>{todo.name}</p>
              <input type="checkbox" checked={todo.completed} onChange={async () => await handleToggleComplete(todo.todoID, todo.completed, todo.name)} />
            </ListItem>
          ))
        ) : (
          <p>No todos found.</p>
        )}
      </UnorderedList>
      <Alert message={mutationError} onClose={() => setMutationError("")} />
    </div>
  );
};
export default TodoList;
