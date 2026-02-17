<script lang="ts">
  import type { Column, SortState, SelectionState } from './types';
  import TableHeader from './TableHeader.svelte';
  import TableBody from './TableBody.svelte';
  import TablePagination from './TablePagination.svelte';
  import { createEventDispatcher } from 'svelte';

  type T = $$Generic;

  export let data: T[] = [];
  export let columns: Column<T>[] = [];
  export let pageSize = 10;
  export let currentPage = 1;
  export let sortable = true;
  export let selectable = false;
  export let stickyHeader = false;
  export let loading = false;
  export let emptyMessage = 'No data available';

  const dispatch = createEventDispatcher<{
    sort: SortState<T>;
    select: SelectionState<T>;
    pageChange: number;
  }>();

  let sortState: SortState<T> | null = null;
  let selectedRows: Set<T> = new Set();

  $: totalPages = Math.ceil(data.length / pageSize);
  $: startIndex = (currentPage - 1) * pageSize;
  $: endIndex = Math.min(startIndex + pageSize, data.length);

  $: sortedData = sortState
    ? [...data].sort((a, b) => {
        const aVal = sortState.column.accessor(a);
        const bVal = sortState.column.accessor(b);
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortState.direction === 'asc' ? cmp : -cmp;
      })
    : data;

  $: displayData = sortedData.slice(startIndex, endIndex);

  function handleSort(column: Column<T>) {
    if (!sortable || !column.sortable) return;

    if (sortState?.column === column) {
      sortState = sortState.direction === 'asc'
        ? { column, direction: 'desc' }
        : null;
    } else {
      sortState = { column, direction: 'asc' };
    }

    dispatch('sort', sortState);
  }

  function handleRowSelect(row: T) {
    if (!selectable) return;

    if (selectedRows.has(row)) {
      selectedRows.delete(row);
    } else {
      selectedRows.add(row);
    }
    selectedRows = selectedRows;
    dispatch('select', { selected: [...selectedRows] });
  }

  function handleSelectAll() {
    if (selectedRows.size === displayData.length) {
      selectedRows.clear();
    } else {
      selectedRows = new Set(displayData);
    }
    selectedRows = selectedRows;
    dispatch('select', { selected: [...selectedRows] });
  }
</script>

<div class="datatable" class:loading role="grid" aria-busy={loading}>
  <table>
    <TableHeader
      {columns}
      {sortable}
      {selectable}
      {sortState}
      {stickyHeader}
      allSelected={selectedRows.size === displayData.length && displayData.length > 0}
      on:sort={(e) => handleSort(e.detail)}
      on:selectAll={handleSelectAll}
    />
    <TableBody
      data={displayData}
      {columns}
      {selectable}
      {selectedRows}
      {emptyMessage}
      on:select={(e) => handleRowSelect(e.detail)}
    />
  </table>

  {#if totalPages > 1}
    <TablePagination
      {currentPage}
      {totalPages}
      totalItems={data.length}
      {pageSize}
      on:pageChange={(e) => {
        currentPage = e.detail;
        dispatch('pageChange', currentPage);
      }}
    />
  {/if}
</div>

<style>
  .datatable {
    width: 100%;
    overflow-x: auto;
    border: 1px solid var(--dt-border-color, #e1e4e8);
    border-radius: var(--dt-border-radius, 6px);
  }

  .datatable.loading {
    opacity: 0.6;
    pointer-events: none;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--dt-font-size, 14px);
  }
</style>