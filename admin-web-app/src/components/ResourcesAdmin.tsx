import React, { useEffect, useState } from 'react';

interface Resource {
  Id: number;
  CompanyId: number;
  Identifier: string;
  Type: string;
  Capacity: number;
}

const ResourcesAdmin: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('http://backend.localhost/api/resources/all');
      if (!response.ok) {
        throw new Error('Problem fetching resources');
      }
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const addResource = async (resource: Omit<Resource, 'Id'>) => {
    // Implement the logic to add a resource here
  };

  const updateResource = async (id: number, resource: Omit<Resource, 'Id'>) => {
    // Implement the logic to update resource details here
  };

  const deleteResource = async (id: number) => {
    // Implement the logic to delete a resource here
  };

  return (
    <div>
      <h1>Resources</h1>
      {loading ? (
        <p>Loading resources...</p>
      ) : (
        resources.map((resource) => (
          <div key={resource.Id}>
            <p>Identifier: {resource.Identifier}</p>
            <p>Type: {resource.Type}</p>
            <p>Capacity: {resource.Capacity}</p>
            {/* Provide forms or UI elements to edit and delete resources */}
          </div>
        ))
      )}
      {/* Provide a form to add a new resource */}
    </div>
  );
};

export default ResourcesAdmin;
