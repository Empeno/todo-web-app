-- ============================================================
-- TodoItems – handy queries
-- Connect with the "todo-app (Azure SQL)" profile, then click
-- "Run" (or select a statement and press the Run Query button).
-- ============================================================

-- All to-do items (including the hidden Secret column)
SELECT Id, Name, IsComplete, Secret
FROM dbo.TodoItems
ORDER BY Id;

-- Count of items
SELECT COUNT(*) AS TotalItems
FROM dbo.TodoItems;

-- Only completed / only outstanding
SELECT * FROM dbo.TodoItems WHERE IsComplete = 1;   -- completed
SELECT * FROM dbo.TodoItems WHERE IsComplete = 0;   -- outstanding

-- Peek at the Secret field (omitted from the API/DTO)
SELECT Id, Name, Secret
FROM dbo.TodoItems
WHERE Secret IS NOT NULL;

-- Insert a sample item (incl. a Secret value)
-- INSERT INTO dbo.TodoItems (Name, IsComplete, Secret)
-- VALUES (N'Sample task', 0, N'hidden-value');

-- Update an item by Id
-- UPDATE dbo.TodoItems SET IsComplete = 1 WHERE Id = 1;

-- Delete an item by Id
-- DELETE FROM dbo.TodoItems WHERE Id = 1;

-- Table schema
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'TodoItems'
ORDER BY ORDINAL_POSITION;
