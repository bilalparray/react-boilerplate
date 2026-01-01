export class QueryFilter {
    skip?: number;
    top?: number;
    // Ordering (e.g., "Name asc, CreatedDate desc")
    orderByCommand!: string;

    // Basic search parameters
    searchText!: string;
    searchColumns!: string; // e.g., "FirstName,LastName"
    searchType!: string; // e.g., "contains" or "startswith"

    // Advanced OData Filters (each field is optional)
    filterExpression?: string; // e.g., "Status eq 'Active' and Age gt 30"
    selectFields?: string; // e.g., "Id,FirstName,LastName"
    expandFields?: string; // e.g., "Department,Role"
    inlineCount?: boolean;
}
