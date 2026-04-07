#!/bin/bash
# Quick smoke test for the Task API
# Usage: ./test.sh [base_url]

BASE="${1:-http://localhost:3000}"

echo "=== M1 Express Benchmark: Smoke Test ==="
echo ""

echo "1. POST /tasks (create)"
curl -s -X POST "$BASE/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","description":"Milk, eggs, bread"}' | jq .
echo ""

echo "2. POST /tasks (create another)"
curl -s -X POST "$BASE/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title":"Write benchmarks"}' | jq .
echo ""

echo "3. GET /tasks (list all)"
curl -s "$BASE/tasks" | jq .
echo ""

echo "4. GET /tasks/1 (get by id)"
curl -s "$BASE/tasks/1" | jq .
echo ""

echo "5. PUT /tasks/1 (update)"
curl -s -X PUT "$BASE/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{"completed":true}' | jq .
echo ""

echo "6. DELETE /tasks/2"
curl -s -o /dev/null -w "HTTP %{http_code}\n" -X DELETE "$BASE/tasks/2"
echo ""

echo "7. GET /tasks/999 (not found)"
curl -s "$BASE/tasks/999" | jq .
echo ""

echo "=== Done ==="
