import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchResources } from '../store/resources/resourcesSlice';
import Table, { Column } from './Table';
import { Resource } from '../types/resourceTypes';

const ResourceTable: React.FC = () => {
  const { resources, loading, error } = useSelector((state: RootState) => state.resources);
  const dispatch = useDispatch<AppDispatch>();

  const [typeFilter, setTypeFilter] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchResources());
  }, [dispatch]);

  if (loading) return <p>Loading resources...</p>;
  if (error) return <p>Error: {error}</p>;

  const filteredResources = resources.filter(resource =>
    resource.Type.toLowerCase().includes(typeFilter.toLowerCase()) &&
    (capacityFilter === '' || resource.Capacity >= Number(capacityFilter))
  );

  const totalItems = filteredResources.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResources.slice(indexOfFirstItem, indexOfLastItem);

  const columns: Column<Resource>[] = [
    { Header: 'Identifier', accessor: 'Identifier', isSortable: true },
    { Header: 'Type', accessor: 'Type', isSortable: true },
    { Header: 'Capacity', accessor: 'Capacity', isSortable: true }
  ];

  return (
    <div>
      <h1>Resources List</h1>
      <div>
        <label htmlFor="typeFilter">Filter by Type:</label>
        <input
          id="typeFilter"
          type="text"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        />
        <label htmlFor="capacityFilter">Minimum Capacity:</label>
        <input
          id="capacityFilter"
          type="number"
          value={capacityFilter}
          onChange={(e) => setCapacityFilter(e.target.value)}
        />
      </div>
      <Table
        columns={columns}
        data={currentItems}
        onPaginate={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages} keyAccessor={'Identifier'}  />
    </div>
  );
};

export default ResourceTable;
