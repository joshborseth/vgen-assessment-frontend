import { useEffect, useMemo, useState } from "react";
import PageLayout from "../components/PageLayout";
import apiFetch from "../functions/apiFetch";
import Container from "../components/Container";
import Select from "../components/Select";
import styled from "styled-components";
import { useRouter } from "next/router";
import TodoList from "../components/TodoList";

//define a constant for the filter options
const FILTERS = ["all", "completed", "incompleted"];

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  //get the filter from the query param
  const filter = router.query.filter ?? "all";

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      setError("");
      setTodos([]);
      try {
        const response = await apiFetch("/todo");
        if (response.status !== 200) {
          throw new Error("Failed to retrieve todos");
        }
        setTodos(response.body);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);
  //we are filtering todos on the client side vs the server
  //this is so that we can avoid fetching the todos again when the filter changes
  const getFilteredTodos = (todos, filter) => {
    if (filter === "all") {
      return todos;
    }
    //filter out todos that dont match the currently selected filter
    return todos.filter((todo) => todo.completed === (filter === "completed"));
  };

  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);

  return (
    <PageLayout title="My Todos">
      <Container>
        <div className="content">
          <HeadingContainer>
            <h1>My Todos</h1>
            <Select value={filter} onChange={(e) => router.push({ query: { ...router.query, filter: e.target.value } })}>
              {FILTERS.map((filter) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </Select>
          </HeadingContainer>
          <TodoList todos={visibleTodos} setTodos={setTodos} loading={loading} error={error} />
        </div>
      </Container>
    </PageLayout>
  );
};

export default Todos;

const HeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
