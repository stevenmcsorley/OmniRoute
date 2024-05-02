import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchEmployees } from "../store/employees/employeesSlice";
import Table from "./Table"; 
import { Column } from "./Table"; 
import { Employee } from "../types/employeeTypes";

const Employees: React.FC = () => {
  const { employees, loading, error } = useSelector(
    (state: RootState) => state.employees
  );
  const dispatch = useDispatch<AppDispatch>();

  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p>Error: {error}</p>;

  const filteredEmployees = employees.filter(
    (employee) =>
      (nameFilter === "" ||
        `${employee.FirstName} ${employee.LastName}`
          .toLowerCase()
          .includes(nameFilter.toLowerCase())) &&
      (emailFilter === "" ||
        employee.Email.toLowerCase().includes(emailFilter.toLowerCase())) &&
      (phoneFilter === "" || employee.Phone.includes(phoneFilter)) &&
      (roleFilter === "" ||
        employee.Role.toLowerCase().includes(roleFilter.toLowerCase()))
  );

  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const columns: Column<Employee>[] = [
    { Header: "Name", accessor: "FirstName", isSortable: true },
    { Header: "Email", accessor: "Email", isSortable: true },
    { Header: "Phone", accessor: "Phone", isSortable: false },
    { Header: "Role", accessor: "Role", isSortable: true },
  ];

  return (
    <div>
      <h1>Employees</h1>
      <div>
        <input
          type="text"
          placeholder="Filter by Name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Phone"
          value={phoneFilter}
          onChange={(e) => setPhoneFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Role"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        />
      </div>
      <Table
        columns={columns}
        data={currentItems}
        onPaginate={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
        keyAccessor={"FirstName"}
      />
    </div>
  );
};

export default Employees;
